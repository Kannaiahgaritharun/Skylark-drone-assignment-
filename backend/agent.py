import os
import json
import logging
import google.generativeai as genai
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("GEMINI_API_KEY is loaded and configured.")
else:
    logger.error("WARNING: GEMINI_API_KEY is not set.")

def get_agent_response(user_query, monday_data):
    """
    Calls Gemini API to process the user query using the Monday.com data context.
    Returns a structured JSON response.
    """
    logger.info(f"Incoming user query to Agent: {user_query}")
    
    if not GEMINI_API_KEY:
        logger.error("Failing request because Gemini API key is missing.")
        raise Exception("Missing Environment Variable: GEMINI_API_KEY")
        
    system_instruction = """
    You are a Senior AI Solutions Architect and Full Stack Engineer acting as an AI Business Intelligence Agent for a company called Skylark Drones.
    
    You will be provided with data from Monday.com Boards (Deals and Work Orders) in JSON format.
    Your goal is to answer the user's question by acting like a senior business analyst, not just a database.
    
    You must classify user intent into categories: Revenue, Pipeline, Work Orders, Risk, Operations, Delivery, Sector Analysis, Leadership Summary, Cross Board Analytics, Forecasting.
    Before analysis, handle missing values, normalize names, and report data quality issues.
    
    Instead of only returning numbers, explain:
    - trends
    - risks
    - insights
    - recommendations
    - confidence
    - data quality issues
    
    Output Format Requirements:
    You MUST output valid JSON only, following this schema exactly:
    {
      "ExecutiveSummary": "A concise summary answering the user's question.",
      "BusinessMetrics": [
         {"label": "Metric Name", "value": "Metric Value"}
      ],
      "Insights": ["Insight 1", "Insight 2"],
      "Risks": ["Risk 1", "Risk 2"],
      "Recommendations": ["Recommendation 1", "Recommendation 2"],
      "DataQualityNotes": ["Issue 1", "Issue 2"],
      "ConfidenceScore": "High|Medium|Low",
      "ChartData": [{"name": "Month", "value": 0}],
      "SectorData": [{"name": "Sector", "value": 0}],
      "RecentDeals": [{"id": "ID", "name": "Name", "customer": "Client", "owner": "Owner", "value": "Value", "stage": "Stage", "probability": "0%", "status": "Status"}],
      "RecentWorkOrders": [{"id": "ID", "project": "Name", "client": "Client", "date": "Date", "priority": "High", "status": "Status"}]
    }
    
    Do not include any markdown formatting blocks like ```json around the response, return raw JSON string.
    Never hallucinate. Always mention uncertainty.
    """
    
    # Dynamically select a list of supported models to try
    models_to_try = []
    try:
        available_models = [m.name.replace('models/', '') for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        logger.info(f"Available supported Gemini models: {available_models}")
        
        preferred_models = ['gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-flash-latest']
        for pm in preferred_models:
            if pm in available_models:
                models_to_try.append(pm)
                
        if not models_to_try and available_models:
            models_to_try.append(available_models[-1]) # Pick the newest fallback
            
    except Exception as e:
        logger.warning(f"Could not list models dynamically: {e}")
        
    if not models_to_try:
        models_to_try = ['gemini-2.5-flash']
        
    data_context = json.dumps(monday_data, default=str)
    prompt = f"User Question: {user_query}\n\nMonday.com Data Context:\n{data_context}"
    
    import time
    last_error = None
    
    for attempt, model_name in enumerate(models_to_try):
        logger.info(f"Initializing Gemini model: {model_name}")
        model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
        logger.info(f"Sending prompt to Gemini API (Attempt {attempt + 1}, Model: {model_name})...")
        
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()
            logger.info(f"Gemini Raw Response from {model_name}: {text[:200]}...")
            
            # Strip markdown json block if present
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
                
            if text.endswith("```"):
                text = text[:-3]
                
            text = text.strip()
            
            try:
                parsed_json = json.loads(text)
                logger.info(f"Successfully generated and parsed JSON response using model: {model_name}")
                return parsed_json
            except json.JSONDecodeError as json_err:
                logger.error(f"JSON Parse Error. Raw string was:\n{text}")
                # Treat JSON parse error as non-transient for this specific response
                raise Exception(f"JSON Parse Error: {json_err}")
                
        except Exception as e:
            error_msg = str(e).lower()
            last_error = e
            logger.error(f"Error calling Gemini model {model_name}: {e}")
            
            # Check for transient errors
            if any(transient in error_msg for transient in ['429', '503', 'timeout', 'quota', 'exhausted', 'unavailable']):
                if attempt < len(models_to_try) - 1:
                    sleep_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s...
                    logger.warning(f"Transient error detected. Retrying with next model in {sleep_time}s...")
                    time.sleep(sleep_time)
                    continue
                else:
                    logger.error("All available models failed due to transient errors.")
                    break
            else:
                logger.error("Non-transient error detected. Aborting retries.")
                break

    # If all models failed, raise the last exception to trigger the graceful fallback in main.py
    raise Exception(f"Gemini API Error: {str(last_error)}")

