"""
AgriLink FastAPI Application
Main backend API server for the AgriLink Platform.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import shutil
import uuid

import ai_engine
import database

app = FastAPI(
    title="AgriLink API",
    description="AI-powered Agriculture Marketplace connecting verified farmers directly with buyers.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Pydantic Schemas
class RecommendRequest(BaseModel):
    location: str = "East Godavari, AP"
    land_size_acres: float = 5.0
    soil_type: str = "Alluvial"
    available_water: str = "Canal & Borewell"
    current_season: str = "Rabi"
    previous_crop: str = "Rice"
    investment_level: str = "Medium"

class ChatRequest(BaseModel):
    query: str
    language: str = "en"

class VoiceIntentRequest(BaseModel):
    text: str

class CreateListingRequest(BaseModel):
    farmer_id: str = "farmer_1"
    farmer_name: str = "Ramesh Varma"
    farmer_phone: str = "+91 98480 12345"
    crop_name: str
    category: str = "Vegetables"
    variety: str
    quantity_kg: float
    price_per_kg: float
    harvest_date: str
    location: str
    distance_km: int = 20
    grade: str = "Grade A"
    farming_type: str = "Conventional"
    ai_crop_verified: bool = True
    confidence_score: float = 95.0
    expected_availability: str = "Immediate"
    image_url: Optional[str] = None

class CreateRequirementRequest(BaseModel):
    buyer_id: str = "buyer_1"
    buyer_name: str = "FreshMart Supermarket Supply"
    buyer_contact: str = "+91 98765 43210"
    buyer_location: str = "Rajahmundry / Vijayawada"
    crop_name: str
    quantity_kg: float
    max_price_per_kg: float
    required_by: str
    required_grade: str = "Grade A"
    max_distance_km: int = 50
    preferred_farming: str = "Conventional / IPM"
    delivery_requirement: str = "Farmer delivery"
    notes: Optional[str] = None

class CreateOrderRequest(BaseModel):
    listing_id: str
    buyer_id: str = "buyer_1"
    buyer_name: str = "FreshMart Supermarket Supply"
    buyer_phone: str = "+91 98765 43210"
    farmer_id: str
    farmer_name: str
    crop_name: str
    variety: str
    quantity_kg: float
    price_per_kg: float
    delivery_address: str = "FreshMart Warehouse, NH-16"

class StatusUpdateRequest(BaseModel):
    status: str


# Root Health Check
@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "AgriLink AI Agriculture Platform",
        "version": "1.0.0",
        "features": [
            "AI Crop Identification",
            "What Should I Grow? Season Recommendation",
            "Seasonal Price Intelligence",
            "Smart Farmer-Buyer Matching",
            "AgriAssist Voice AI Chatbot"
        ]
    }


# Crops Catalog
@app.get("/api/crops")
def get_crops():
    crops_summary = []
    for name, data in ai_engine.CROP_DATABASE.items():
        crops_summary.append({
            "name": name,
            "category": data["category"],
            "varieties": data["varieties"],
            "season": data["season"],
            "current_demand": data["current_demand"],
            "average_price": data["avg_market_price"],
            "price_unit": data["price_unit"],
            "risk_level": data["risk_level"],
            "profitability": data["profitability"]
        })
    return {"crops": crops_summary}


# 1. AI Crop Identification
@app.post("/api/ai/identify")
async def identify_crop(
    file: Optional[UploadFile] = File(None),
    crop_hint: Optional[str] = Form(None)
):
    filename = "sample_tomato.jpg"
    size = 50000

    if file:
        filename = file.filename
        ext = os.path.splitext(filename)[1]
        save_filename = f"{uuid.uuid4().hex[:10]}{ext}"
        dest_path = os.path.join(UPLOAD_DIR, save_filename)
        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_url = f"/uploads/{save_filename}"
    else:
        file_url = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop"

    res = ai_engine.identify_crop_from_image(filename=filename, file_bytes_size=size, hint=crop_hint)
    res["uploaded_image_url"] = file_url
    return res


# 2. "What Should I Grow?" Recommendation
@app.post("/api/ai/recommend")
def get_crop_recommendation(payload: RecommendRequest):
    recs = ai_engine.recommend_crops(
        location=payload.location,
        land_size_acres=payload.land_size_acres,
        soil_type=payload.soil_type,
        available_water=payload.available_water,
        current_season=payload.current_season,
        previous_crop=payload.previous_crop,
        investment_level=payload.investment_level
    )
    return {
        "parameters": payload.model_dump(),
        "recommendations": recs,
        "disclaimer": "AI recommendations are estimates based on regional historical yields and soil compatibility. Final decisions should evaluate local farm conditions."
    }


# 3. Price Intelligence
@app.get("/api/ai/price-trends")
def get_price_trends(
    crop: str = Query("Tomato", description="Crop name"),
    location: str = Query("Rajahmundry", description="Regional mandi"),
    period: str = Query("12 Months", description="Trend period")
):
    return ai_engine.get_price_intelligence(crop_name=crop, location=location, time_period=period)


# 4. Smart Matching System
@app.get("/api/ai/smart-matches")
def get_all_smart_matches():
    matches = []
    for req in database.BUYER_REQUIREMENTS:
        for listing in database.LISTINGS:
            if listing["crop_name"].lower() == req["crop_name"].lower():
                calc = ai_engine.calculate_smart_match(listing, req)
                matches.append({
                    "requirement": req,
                    "listing": listing,
                    "match_analysis": calc
                })
    # Sort descending by match percentage
    matches.sort(key=lambda x: x["match_analysis"]["match_percentage"], reverse=True)
    return {"matches": matches}


# 5. AgriAssist AI Chatbot
@app.post("/api/ai/chat")
def chat_with_agriassist(payload: ChatRequest):
    return ai_engine.handle_agriassist_chat(query=payload.query, language=payload.language)


# 6. Voice Intent Parser
@app.post("/api/ai/parse-voice")
def parse_voice(payload: VoiceIntentRequest):
    return ai_engine.parse_voice_listing_intent(text=payload.text)


# Listings Endpoints
@app.get("/api/listings")
def get_listings(
    crop: Optional[str] = None,
    category: Optional[str] = None,
    max_price: Optional[float] = None,
    location: Optional[str] = None,
    grade: Optional[str] = None
):
    results = database.get_all_listings(crop_filter=crop, max_price=max_price, location_query=location)
    if category:
        results = [l for l in results if l.get("category", "").lower() == category.lower()]
    if grade:
        results = [l for l in results if l.get("grade", "").lower() == grade.lower()]
    return {"listings": results, "total": len(results)}

@app.post("/api/listings")
def create_listing(payload: CreateListingRequest):
    data = payload.model_dump()
    data["total_value"] = data["quantity_kg"] * data["price_per_kg"]
    if not data.get("image_url"):
        # Assign fallback realistic image based on crop
        crop_name = data["crop_name"].lower()
        if "tomato" in crop_name:
            data["image_url"] = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop"
        elif "chilli" in crop_name or "mirchi" in crop_name:
            data["image_url"] = "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&h=400&fit=crop"
        elif "rice" in crop_name or "paddy" in crop_name:
            data["image_url"] = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop"
        elif "onion" in crop_name:
            data["image_url"] = "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=400&fit=crop"
        else:
            data["image_url"] = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop"

    new_listing = database.add_listing(data)
    return {"success": True, "listing": new_listing}

@app.get("/api/listings/{listing_id}")
def get_listing_detail(listing_id: str):
    for l in database.LISTINGS:
        if l["id"] == listing_id:
            farmer = database.get_farmer_by_id(l.get("farmer_id", "farmer_1"))
            return {"listing": l, "farmer": farmer}
    raise HTTPException(status_code=404, detail="Listing not found")


# Profiles & Users
@app.get("/api/farmers/{farmer_id}")
def get_farmer_profile(farmer_id: str):
    farmer = database.get_farmer_by_id(farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    farmer_listings = [l for l in database.LISTINGS if l.get("farmer_id") == farmer_id]
    return {
        "farmer": farmer,
        "active_listings": farmer_listings,
        "completed_deals": [o for o in database.ORDERS if o.get("farmer_id") == farmer_id]
    }

@app.get("/api/buyers/{buyer_id}")
def get_buyer_profile(buyer_id: str):
    buyer = database.get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    buyer_reqs = [r for r in database.BUYER_REQUIREMENTS if r.get("buyer_id") == buyer_id]
    return {
        "buyer": buyer,
        "active_requirements": buyer_reqs,
        "order_history": [o for o in database.ORDERS if o.get("buyer_id") == buyer_id]
    }


# Buyer Requirements ("I Need This Crop")
@app.get("/api/requirements")
def get_requirements(crop: Optional[str] = None):
    reqs = database.BUYER_REQUIREMENTS
    if crop:
        reqs = [r for r in reqs if r["crop_name"].lower() == crop.lower()]
    return {"requirements": reqs, "total": len(reqs)}

@app.post("/api/requirements")
def create_requirement(payload: CreateRequirementRequest):
    new_req = database.add_buyer_requirement(payload.model_dump())
    return {"success": True, "requirement": new_req}


# Orders & Direct Transactions
@app.get("/api/orders")
def get_orders(user_id: Optional[str] = None, role: Optional[str] = None):
    orders = database.ORDERS
    if user_id:
        if role == "farmer":
            orders = [o for o in orders if o.get("farmer_id") == user_id]
        elif role == "buyer":
            orders = [o for o in orders if o.get("buyer_id") == user_id]
        else:
            orders = [o for o in orders if o.get("farmer_id") == user_id or o.get("buyer_id") == user_id]
    return {"orders": orders}

@app.post("/api/orders")
def place_order(payload: CreateOrderRequest):
    data = payload.model_dump()
    data["total_amount"] = data["quantity_kg"] * data["price_per_kg"]
    order = database.add_order(data)
    return {"success": True, "order": order}

@app.put("/api/orders/{order_id}/status")
def update_status(order_id: str, payload: StatusUpdateRequest):
    updated = database.update_order_status(order_id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"success": True, "order": updated}


# Notifications
@app.get("/api/notifications")
def get_notifications(user_id: Optional[str] = "farmer_1"):
    notifs = [n for n in database.NOTIFICATIONS if n.get("user_id") == user_id or not user_id]
    return {"notifications": notifs, "unread_count": sum(1 for n in notifs if not n.get("read", False))}


# Admin Stats
@app.get("/api/admin/stats")
def get_admin_metrics():
    total_users = len(database.USERS)
    active_farmers = sum(1 for u in database.USERS if u["role"] == "farmer")
    active_buyers = sum(1 for u in database.USERS if u["role"] == "buyer")
    total_listings = len(database.LISTINGS)
    total_orders = len(database.ORDERS)
    volume_traded = sum(o.get("quantity_kg", 0) for o in database.ORDERS)
    turnover_value = sum(o.get("total_amount", 0) for o in database.ORDERS)

    return {
        "summary": {
            "total_users": total_users + 1420,  # Platform realistic scaled metrics
            "active_farmers": active_farmers + 890,
            "active_buyers": active_buyers + 530,
            "total_listings": total_listings + 412,
            "total_orders": total_orders + 384,
            "volume_traded_kg": volume_traded + 1250000,
            "turnover_inr": turnover_value + 36500000
        },
        "most_searched_crops": [
            {"crop": "Tomato", "searches": 4820, "growth": "+18%"},
            {"crop": "Chilli (Guntur Teja)", "searches": 3940, "growth": "+27%"},
            {"crop": "Onion", "searches": 3410, "growth": "+12%"},
            {"crop": "Rice (Basmati)", "searches": 2980, "growth": "+9%"},
            {"crop": "Cotton", "searches": 2150, "growth": "+14%"}
        ],
        "regional_demand": [
            {"region": "Andhra Pradesh (East Godavari / Guntur)", "demand_score": 96, "top_crop": "Tomato & Chilli"},
            {"region": "Telangana (Warangal / Nizamabad)", "demand_score": 91, "top_crop": "Maize & Cotton"},
            {"region": "Maharashtra (Nashik / Pune)", "demand_score": 89, "top_crop": "Onion & Pomegranate"},
            {"region": "Punjab & Haryana", "demand_score": 88, "top_crop": "Wheat & Basmati"}
        ],
        "reported_items": [
            {"id": "rep_1", "type": "Listing", "target": "Listing #list_3", "reason": "Price mismatch reported", "status": "Under Review"},
            {"id": "rep_2", "type": "User", "target": "Unverified Trader", "reason": "Multiple unfulfilled requests", "status": "Flagged"}
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
