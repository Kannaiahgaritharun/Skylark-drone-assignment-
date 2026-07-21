import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import time
from monday_api import get_all_data
from agent import get_agent_response

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Skylark Drones BI Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CACHE SETUP ---
response_cache = {}
monday_data_cache = {"data": None, "timestamp": 0}
CACHE_TTL = 600  # 10 minutes

def get_cached_monday_data():
    now = time.time()
    if monday_data_cache["data"] and (now - monday_data_cache["timestamp"] < CACHE_TTL):
        logger.info("Using cached Monday.com data.")
        return monday_data_cache["data"]
    
    logger.info("Fetching fresh Monday.com data.")
    data = get_all_data()
    monday_data_cache["data"] = data
    monday_data_cache["timestamp"] = now
    return data

def generate_fallback_data(monday_data, error_msg):
    deals = monday_data.get("deals", [])
    work_orders = monday_data.get("work_orders", [])
    
    # Process Deals
    recent_deals = []
    total_value = 0
    for d in deals[:20]:
        val_str = str(d.get("Deal Value", "0")).replace("$", "").replace(",", "")
        try:
            val = float(val_str) if val_str.replace('.','',1).isdigit() else 0
        except:
            val = 0
        total_value += val
        
        recent_deals.append({
            "id": d.get("id", ""),
            "name": d.get("name", "Unknown Deal"),
            "customer": d.get("Customer", d.get("Client", "")),
            "owner": d.get("Owner", ""),
            "value": d.get("Deal Value", "0"),
            "stage": d.get("Stage", ""),
            "probability": d.get("Probability", "0%"),
            "status": d.get("Status", "Pending")
        })
        
    # Process Work Orders
    recent_wos = []
    for wo in work_orders[:20]:
        recent_wos.append({
            "id": wo.get("id", ""),
            "project": wo.get("name", "Unknown WO"),
            "client": wo.get("Client", ""),
            "date": wo.get("Date", ""),
            "priority": wo.get("Priority", ""),
            "status": wo.get("Status", "Pending")
        })
        
    # Basic Chart Data
    chart_data = [
        {"name": "Jan", "value": total_value * 0.1},
        {"name": "Feb", "value": total_value * 0.2},
        {"name": "Mar", "value": total_value * 0.7}
    ]
    
    sector_data = [
        {"name": "Enterprise", "value": len([d for d in recent_deals if "Enterprise" in str(d.get("customer", ""))]) or 10},
        {"name": "SMB", "value": len([d for d in recent_deals if "SMB" in str(d.get("customer", ""))]) or 5}
    ]
    
    # Determine reason
    reason = "API Error"
    err_str = str(error_msg).lower()
    if "429" in err_str or "quota" in err_str or "exhausted" in err_str:
        reason = "Quota Exceeded"
    elif "timeout" in err_str or "deadline" in err_str:
        reason = "Timeout"
    elif "network" in err_str or "connection" in err_str:
        reason = "Network Failure"
    elif err_str == "startup":
        reason = "Startup Mode"
        
    return {
        "isAIOffline": True if reason != "Startup Mode" else False,
        "offlineReason": reason if reason != "Startup Mode" else "",
        "ExecutiveSummary": "Data loaded directly from Monday.com. Click 'Analyze with AI' for deep insights." if reason == "Startup Mode" else "AI service is temporarily unavailable. Business data from Monday.com has been loaded successfully.",
        "BusinessMetrics": [
            {"label": "Total Pipeline Value", "value": f"${total_value:,.2f}"},
            {"label": "Active Deals", "value": str(len(recent_deals))},
            {"label": "Active Work Orders", "value": str(len(recent_wos))}
        ],
        "Insights": ["Click 'Analyze with AI' to generate AI insights."] if reason == "Startup Mode" else ["The AI is currently offline.", "Displaying live raw data from Monday.com instead."],
        "Risks": ["Run AI analysis to identify risks."] if reason == "Startup Mode" else ["AI analysis cannot be generated at this time."],
        "Recommendations": ["Run AI analysis for recommendations."] if reason == "Startup Mode" else ["Please check your API quota.", "Try again later."],
        "DataQualityNotes": [],
        "ConfidenceScore": "Neutral" if reason == "Startup Mode" else "Low",
        "ChartData": chart_data,
        "SectorData": sector_data,
        "RecentDeals": recent_deals,
        "RecentWorkOrders": recent_wos
    }

class QueryRequest(BaseModel):
    query: str

@app.post("/api/chat")
async def chat(request: QueryRequest):
    query = request.query
    logger.info(f"Received API request for query: {query}")
    
    now = time.time()
    
    # 1. Check AI Response Cache
    if query in response_cache:
        cached_res, timestamp = response_cache[query]
        if now - timestamp < CACHE_TTL:
            logger.info("Returning cached AI response.")
            return cached_res
            
    try:
        # 2. Fetch or Cache Monday Data
        monday_data = get_cached_monday_data()
        
        # 3. Startup Bypass
        if query == "startup_data_only":
            logger.info("Startup mode: bypassing Gemini API.")
            startup_response = generate_fallback_data(monday_data, "startup")
            return startup_response
            
        # 4. Standard AI Call
        agent_response = get_agent_response(query, monday_data)
        logger.info("Successfully returning agent response.")
        agent_response["isAIOffline"] = False
        
        # Save to cache
        response_cache[query] = (agent_response, now)
        return agent_response
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"API Request Failed: {error_msg}")
        
        try:
            monday_data = get_cached_monday_data()
        except:
            monday_data = {"deals": [], "work_orders": []}
            
        fallback_response = generate_fallback_data(monday_data, error_msg)
        return fallback_response

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Skylark Drones API is running. Please use the frontend UI at http://localhost:5173"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

