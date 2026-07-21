import os
import requests
import json
import logging
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()
MONDAY_API_KEY = os.getenv("MONDAY_API_KEY")
MONDAY_API_URL = "https://api.monday.com/v2"

if not MONDAY_API_KEY:
    logger.error("MONDAY_API_KEY is not set.")
else:
    logger.info("MONDAY_API_KEY is loaded.")

HEADERS = {
    "Authorization": MONDAY_API_KEY,
    "Content-Type": "application/json",
    "API-Version": "2023-10"
}

def query_monday(query, variables=None):
    logger.info("Sending request to Monday.com API...")
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
        
    try:
        response = requests.post(MONDAY_API_URL, json=payload, headers=HEADERS)
        response.raise_for_status()
        res_json = response.json()
        
        if "errors" in res_json:
            logger.error(f"Monday API GraphQL Errors: {res_json['errors']}")
            raise Exception(f"Monday API Error: {res_json['errors']}")
            
        logger.info("Monday.com API request successful.")
        return res_json
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error querying Monday.com: {e}")
        if e.response is not None:
             logger.error(f"Response: {e.response.text}")
        raise Exception(f"Monday API Network Error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in query_monday: {e}")
        raise

def fetch_boards():
    query = """
    query {
        boards (limit: 100) {
            id
            name
        }
    }
    """
    logger.info("Fetching Monday boards...")
    res = query_monday(query)
    
    if res and "data" in res and "boards" in res["data"]:
        boards_map = {b["name"]: b["id"] for b in res["data"]["boards"]}
        logger.info(f"Found boards: {list(boards_map.keys())}")
        return boards_map
        
    logger.warning("No boards found in the response.")
    return {}

def fetch_board_items(board_id):
    logger.info(f"Fetching items for board_id: {board_id} with pagination")
    items = []
    cursor = None
    
    while True:
        # Cursor pagination for items_page
        if cursor:
            query = """
            query ($boardId: [ID!], $cursor: String) {
              boards (ids: $boardId) {
                items_page (limit: 500, cursor: $cursor) {
                  cursor
                  items {
                    id
                    name
                    column_values {
                      id
                      type
                      text
                      column {
                        title
                      }
                    }
                  }
                }
              }
            }
            """
            variables = {"boardId": [board_id], "cursor": cursor}
        else:
            query = """
            query ($boardId: [ID!]) {
              boards (ids: $boardId) {
                items_page (limit: 500) {
                  cursor
                  items {
                    id
                    name
                    column_values {
                      id
                      type
                      text
                      column {
                        title
                      }
                    }
                  }
                }
              }
            }
            """
            variables = {"boardId": [board_id]}
            
        res = query_monday(query, variables=variables)
        
        if not res or "data" not in res or not res["data"]["boards"]:
            logger.warning(f"No items found for board_id: {board_id}")
            break
            
        page = res["data"]["boards"][0].get("items_page", {})
        page_items = page.get("items", [])
        cursor = page.get("cursor")
        
        items.extend(page_items)
        logger.info(f"Fetched {len(page_items)} items. Total so far: {len(items)}")
        
        if not cursor:
            break
            
    logger.info(f"Total fetched {len(items)} items from board_id {board_id}")
    
    cleaned_items = []
    for item in items:
        # Skip empty names or deleted records if they somehow appear
        if not item.get("name") or str(item.get("name")).strip() == "":
            continue
            
        cleaned_item = {"id": item["id"], "name": str(item["name"]).strip()}
        
        for cv in item.get("column_values", []):
            title = cv.get("column", {}).get("title", cv.get("id"))
            title = str(title).strip() if title else "unknown_column"
            
            val = cv.get("text")
            
            # Robust Cleaning
            if val is not None:
                val = str(val).strip()
                if val.lower() in ["", "null", "none", "n/a", "-"]:
                    val = None
                    
            cleaned_item[title] = val
            
        # Basic deduplication logic based on ID
        if not any(x['id'] == cleaned_item['id'] for x in cleaned_items):
            cleaned_items.append(cleaned_item)
        
    logger.info(f"Successfully cleaned and deduplicated {len(cleaned_items)} items for board_id {board_id}")
    return cleaned_items

def get_all_data():
    logger.info("Initiating full data fetch from Monday.com...")
    boards = fetch_boards()
    
    # Try multiple common names
    deals_id = boards.get("Deal funnel Data") or boards.get("Deals")
    work_orders_id = boards.get("Work_Order_Tracker Data") or boards.get("Work Orders")
    
    logger.info(f"Using Deals board ID: {deals_id}")
    logger.info(f"Using Work Orders board ID: {work_orders_id}")
    
    deals_data = []
    work_orders_data = []
    
    if deals_id:
        deals_data = fetch_board_items(deals_id)
    else:
        logger.error("Deals board not found. Checked names: 'Deal funnel Data', 'Deals'")
        raise Exception("Deals board not found in Monday.com.")
        
    if work_orders_id:
        work_orders_data = fetch_board_items(work_orders_id)
    else:
        logger.error("Work Orders board not found. Checked names: 'Work_Order_Tracker Data', 'Work Orders'")
        raise Exception("Work Orders board not found in Monday.com.")
        
    logger.info("Data fetch complete.")
    return {
        "deals": deals_data,
        "work_orders": work_orders_data
    }

