"""
AgriLink In-Memory / SQLite Repository with Demo Seed Data
Provides persistent or stateful mock store for farmers, buyers, listings, orders, requirements, and alerts.
"""

from typing import List, Dict, Any, Optional
import datetime

# Pre-populated in-memory data structures
USERS = [
    {
        "id": "farmer_1",
        "name": "Ramesh Varma",
        "phone": "+91 98480 12345",
        "email": "ramesh.farmer@agrilink.in",
        "role": "farmer",
        "language": "te",
        "location": "Rajahmundry, East Godavari, AP",
        "latitude": 17.0005,
        "longitude": 81.8040,
        "farm_size": "6.5 Acres",
        "soil_type": "Alluvial / Loamy",
        "water_source": "Canal & Borewell",
        "farming_experience": "18 Years",
        "is_verified": True,
        "verification_badge": "Verified Farmer ✓",
        "rating": 4.9,
        "review_count": 48,
        "completed_orders": 36,
        "total_earnings": 428000,
        "avatar_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop"
    },
    {
        "id": "farmer_2",
        "name": "Venkat Rao",
        "phone": "+91 94401 23456",
        "email": "venkat.rao@agrilink.in",
        "role": "farmer",
        "language": "te",
        "location": "Guntur, Andhra Pradesh",
        "latitude": 16.3067,
        "longitude": 80.4365,
        "farm_size": "12 Acres",
        "soil_type": "Black Cotton Soil",
        "water_source": "Krishna Canal",
        "farming_experience": "22 Years",
        "is_verified": True,
        "verification_badge": "Verified Farmer ✓",
        "rating": 4.8,
        "review_count": 62,
        "completed_orders": 54,
        "total_earnings": 890000,
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
    },
    {
        "id": "farmer_3",
        "name": "Suresh Patel",
        "phone": "+91 98220 34567",
        "email": "suresh.patel@agrilink.in",
        "role": "farmer",
        "language": "hi",
        "location": "Nashik, Maharashtra",
        "latitude": 19.9975,
        "longitude": 73.7898,
        "farm_size": "8 Acres",
        "soil_type": "Black Loam",
        "water_source": "Borewell & Drip",
        "farming_experience": "14 Years",
        "is_verified": True,
        "verification_badge": "Verified Farmer ✓",
        "rating": 4.7,
        "review_count": 39,
        "completed_orders": 29,
        "total_earnings": 560000,
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
    },
    {
        "id": "farmer_4",
        "name": "Balwinder Singh",
        "phone": "+91 98150 45678",
        "email": "balwinder@agrilink.in",
        "role": "farmer",
        "language": "hi",
        "location": "Karnal, Haryana",
        "latitude": 29.6857,
        "longitude": 76.9905,
        "farm_size": "15 Acres",
        "soil_type": "Alluvial",
        "water_source": "Tube well",
        "farming_experience": "20 Years",
        "is_verified": True,
        "verification_badge": "Verified Farmer ✓",
        "rating": 4.9,
        "review_count": 51,
        "completed_orders": 44,
        "total_earnings": 920000,
        "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
    },
    {
        "id": "buyer_1",
        "name": "FreshMart Supermarket Supply",
        "contact_person": "Anita Sharma (Procurement Head)",
        "phone": "+91 98765 43210",
        "email": "procurement@freshmart.in",
        "role": "buyer",
        "category": "Retail Chain",
        "location": "Vijayawada / Rajahmundry, AP",
        "latitude": 16.5062,
        "longitude": 80.6480,
        "is_verified": True,
        "verification_badge": "Verified Buyer ✓",
        "monthly_volume": "15,000 kg",
        "rating": 4.9,
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
    },
    {
        "id": "buyer_2",
        "name": "Apex Agro Spices & Exports",
        "contact_person": "Kishore Naidu",
        "phone": "+91 99887 76655",
        "email": "orders@apexagro.com",
        "role": "buyer",
        "category": "Spice Exporter",
        "location": "Guntur Spice Park, AP",
        "latitude": 16.3200,
        "longitude": 80.4500,
        "is_verified": True,
        "verification_badge": "Verified Buyer ✓",
        "monthly_volume": "50,000 kg",
        "rating": 4.8,
        "avatar_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop"
    },
    {
        "id": "admin_1",
        "name": "AgriLink Admin",
        "phone": "+91 90000 00000",
        "email": "admin@agrilink.in",
        "role": "admin",
        "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
    }
]

LISTINGS = [
    {
        "id": "list_1",
        "farmer_id": "farmer_1",
        "farmer_name": "Ramesh Varma",
        "farmer_phone": "+91 98480 12345",
        "farmer_verified": True,
        "crop_name": "Tomato",
        "category": "Vegetables",
        "variety": "Arka Rakshak (High Firmness)",
        "quantity_kg": 600,
        "price_per_kg": 28.0,
        "total_value": 16800.0,
        "harvest_date": "2026-10-02",
        "location": "Rajahmundry, East Godavari, AP",
        "distance_km": 18,
        "grade": "Grade A",
        "farming_type": "Conventional (IPM pest management)",
        "ai_crop_verified": True,
        "confidence_score": 96.5,
        "expected_availability": "Ready for dispatch in 2 days",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop",
        "created_at": "2026-09-20T10:00:00Z"
    },
    {
        "id": "list_2",
        "farmer_id": "farmer_2",
        "farmer_name": "Venkat Rao",
        "farmer_phone": "+91 94401 23456",
        "farmer_verified": True,
        "crop_name": "Chilli",
        "category": "Spices",
        "variety": "Guntur Teja (Stem-less, Export spec)",
        "quantity_kg": 1200,
        "price_per_kg": 185.0,
        "total_value": 222000.0,
        "harvest_date": "2026-09-28",
        "location": "Guntur, Andhra Pradesh",
        "distance_km": 42,
        "grade": "Grade A",
        "farming_type": "Natural / Residue Free",
        "ai_crop_verified": True,
        "confidence_score": 97.2,
        "expected_availability": "Immediate",
        "image_url": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&h=400&fit=crop",
        "created_at": "2026-09-21T09:30:00Z"
    },
    {
        "id": "list_3",
        "farmer_id": "farmer_3",
        "farmer_name": "Suresh Patel",
        "farmer_phone": "+91 98220 34567",
        "farmer_verified": True,
        "crop_name": "Onion",
        "category": "Vegetables",
        "variety": "Nashik Red (Medium 45mm-55mm)",
        "quantity_kg": 3000,
        "price_per_kg": 31.0,
        "total_value": 93000.0,
        "harvest_date": "2026-10-10",
        "location": "Nashik, Maharashtra",
        "distance_km": 65,
        "grade": "Grade A",
        "farming_type": "Conventional",
        "ai_crop_verified": True,
        "confidence_score": 95.8,
        "expected_availability": "Cured & ready in crates",
        "image_url": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=400&fit=crop",
        "created_at": "2026-09-19T14:15:00Z"
    },
    {
        "id": "list_4",
        "farmer_id": "farmer_4",
        "farmer_name": "Balwinder Singh",
        "farmer_phone": "+91 98150 45678",
        "farmer_verified": True,
        "crop_name": "Rice",
        "category": "Cereals",
        "variety": "Basmati 1121 Extra Long Grain",
        "quantity_kg": 5000,
        "price_per_kg": 36.0,
        "total_value": 180000.0,
        "harvest_date": "2026-10-15",
        "location": "Karnal, Haryana",
        "distance_km": 80,
        "grade": "Grade A",
        "farming_type": "Certified Organic",
        "ai_crop_verified": True,
        "confidence_score": 98.0,
        "expected_availability": "Pre-order for harvest batch",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop",
        "created_at": "2026-09-18T16:00:00Z"
    },
    {
        "id": "list_5",
        "farmer_id": "farmer_1",
        "farmer_name": "Ramesh Varma",
        "farmer_phone": "+91 98480 12345",
        "farmer_verified": True,
        "crop_name": "Mango",
        "category": "Fruits",
        "variety": "Banganapalli Carbide-Free Naturally Ripened",
        "quantity_kg": 1500,
        "price_per_kg": 65.0,
        "total_value": 97500.0,
        "harvest_date": "2026-05-15",
        "location": "Rajahmundry, East Godavari, AP",
        "distance_km": 20,
        "grade": "Grade A Premium",
        "farming_type": "Organic Orchard",
        "ai_crop_verified": True,
        "confidence_score": 94.0,
        "expected_availability": "Pre-booking season",
        "image_url": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=400&fit=crop",
        "created_at": "2026-09-15T11:00:00Z"
    }
]

BUYER_REQUIREMENTS = [
    {
        "id": "req_1",
        "buyer_id": "buyer_1",
        "buyer_name": "FreshMart Supermarket Supply",
        "buyer_contact": "Anita Sharma (+91 98765 43210)",
        "buyer_location": "Rajahmundry / Vijayawada",
        "crop_name": "Tomato",
        "quantity_kg": 500,
        "max_price_per_kg": 32.0,
        "required_by": "2026-10-05",
        "required_grade": "Grade A",
        "max_distance_km": 50,
        "preferred_farming": "Conventional / IPM",
        "delivery_requirement": "Farmer delivery or Hub pickup",
        "notes": "Looking for fresh, firm tomatoes with minimum 5 days shelf life for retail shelves.",
        "status": "Active",
        "responses_count": 2,
        "created_at": "2026-09-21T08:00:00Z"
    },
    {
        "id": "req_2",
        "buyer_id": "buyer_2",
        "buyer_name": "Apex Agro Spices & Exports",
        "buyer_contact": "Kishore Naidu (+91 99887 76655)",
        "buyer_location": "Guntur Spice Park",
        "crop_name": "Chilli",
        "quantity_kg": 1000,
        "max_price_per_kg": 195.0,
        "required_by": "2026-10-10",
        "required_grade": "Grade A",
        "max_distance_km": 75,
        "preferred_farming": "Residue Free / IPM",
        "delivery_requirement": "Direct delivery at Guntur warehouse",
        "notes": "Teja or S4 variety required with bright red color value and moisture content under 10%.",
        "status": "Active",
        "responses_count": 3,
        "created_at": "2026-09-20T12:00:00Z"
    },
    {
        "id": "req_3",
        "buyer_id": "buyer_1",
        "buyer_name": "FreshMart Supermarket Supply",
        "buyer_contact": "Anita Sharma",
        "buyer_location": "Vijayawada",
        "crop_name": "Onion",
        "quantity_kg": 1500,
        "max_price_per_kg": 34.0,
        "required_by": "2026-10-12",
        "required_grade": "Grade A",
        "max_distance_km": 100,
        "preferred_farming": "Any",
        "delivery_requirement": "Warehouse unloading",
        "notes": "Dry red onions, sorted size 50mm+.",
        "status": "Active",
        "responses_count": 1,
        "created_at": "2026-09-22T06:00:00Z"
    }
]

ORDERS = [
    {
        "id": "ORD-1092",
        "listing_id": "list_1",
        "buyer_id": "buyer_1",
        "buyer_name": "FreshMart Supermarket Supply",
        "buyer_phone": "+91 98765 43210",
        "farmer_id": "farmer_1",
        "farmer_name": "Ramesh Varma",
        "farmer_phone": "+91 98480 12345",
        "crop_name": "Tomato",
        "variety": "Arka Rakshak",
        "quantity_kg": 500,
        "price_per_kg": 28.0,
        "total_amount": 14000.0,
        "status": "Accepted",  # Pending, Accepted, Dispatched, Delivered, Completed, Cancelled
        "delivery_address": "FreshMart Regional DC, NH-16, Rajahmundry Bypass",
        "payment_status": "Escrow Secured",
        "expected_delivery": "2026-10-04",
        "tracking_steps": [
            {"step": "Order Placed", "time": "2026-09-21 14:00", "completed": True},
            {"step": "Farmer Accepted", "time": "2026-09-21 16:30", "completed": True},
            {"step": "Quality Verified", "time": "2026-09-22 09:00", "completed": True},
            {"step": "Dispatched", "time": "Scheduled Oct 03", "completed": False},
            {"step": "Delivered", "time": "Scheduled Oct 04", "completed": False}
        ],
        "created_at": "2026-09-21T14:00:00Z"
    },
    {
        "id": "ORD-1088",
        "listing_id": "list_2",
        "buyer_id": "buyer_2",
        "buyer_name": "Apex Agro Spices & Exports",
        "buyer_phone": "+91 99887 76655",
        "farmer_id": "farmer_2",
        "farmer_name": "Venkat Rao",
        "farmer_phone": "+91 94401 23456",
        "crop_name": "Chilli",
        "variety": "Guntur Teja",
        "quantity_kg": 1000,
        "price_per_kg": 182.0,
        "total_amount": 182000.0,
        "status": "Completed",
        "delivery_address": "Guntur Spices Yard, Export Bay 4",
        "payment_status": "Paid to Farmer Account",
        "expected_delivery": "2026-09-18",
        "tracking_steps": [
            {"step": "Order Placed", "time": "2026-09-16 11:00", "completed": True},
            {"step": "Farmer Accepted", "time": "2026-09-16 12:15", "completed": True},
            {"step": "Quality Verified", "time": "2026-09-17 10:00", "completed": True},
            {"step": "Dispatched", "time": "2026-09-17 15:00", "completed": True},
            {"step": "Delivered", "time": "2026-09-18 16:00", "completed": True}
        ],
        "created_at": "2026-09-16T11:00:00Z"
    }
]

NOTIFICATIONS = [
    {
        "id": "notif_1",
        "user_id": "farmer_1",
        "type": "Buyer Alert",
        "title": "New Nearby Buyer Requirement!",
        "message": "FreshMart Supermarkets posted a requirement for 500 kg Tomato within 18 km of your farm.",
        "time": "10 minutes ago",
        "read": False,
        "action_link": "/smart-matching"
    },
    {
        "id": "notif_2",
        "user_id": "farmer_1",
        "type": "Price Alert",
        "title": "Mandi Tomato Price Surging",
        "message": "Tomato prices in Rajahmundry wholesale hub jumped +₹4/kg today due to inter-state demand.",
        "time": "2 hours ago",
        "read": False,
        "action_link": "/price-intelligence"
    },
    {
        "id": "notif_3",
        "user_id": "farmer_1",
        "type": "Listing Alert",
        "title": "Order Placed for Your Tomatoes!",
        "message": "FreshMart has placed an order ORD-1092 for 500 kg at ₹28/kg. Please confirm dispatch readiness.",
        "time": "Yesterday",
        "read": True,
        "action_link": "/orders"
    },
    {
        "id": "notif_4",
        "user_id": "buyer_1",
        "type": "Smart Match Alert",
        "title": "96% AI Match Discovered!",
        "message": "Farmer Ramesh Varma in Rajahmundry listed 600 kg Grade A Tomatoes matching your requirement #REQ-1.",
        "time": "15 minutes ago",
        "read": False,
        "action_link": "/smart-matching"
    }
]

CHAT_MESSAGES = [
    {
        "order_id": "ORD-1092",
        "sender_id": "buyer_1",
        "sender_name": "Anita (FreshMart)",
        "message": "Hello Ramesh ji, we noticed your listing for Arka Rakshak tomatoes. Can you dispatch in crates?",
        "timestamp": "2026-09-21 14:15"
    },
    {
        "order_id": "ORD-1092",
        "sender_id": "farmer_1",
        "sender_name": "Ramesh Varma",
        "message": "Namaskaram Anita garu! Yes, we have 25 kg ventilated plastic crates ready. Fruit firmness is excellent.",
        "timestamp": "2026-09-21 14:30"
    },
    {
        "order_id": "ORD-1092",
        "sender_id": "buyer_1",
        "sender_name": "Anita (FreshMart)",
        "message": "Super! We have placed the order for 500 kg through AgriLink direct escrow.",
        "timestamp": "2026-09-21 14:35"
    }
]


# Helper repository functions
def get_all_listings(crop_filter: Optional[str] = None, max_price: Optional[float] = None, location_query: Optional[str] = None) -> List[Dict[str, Any]]:
    res = list(LISTINGS)
    if crop_filter:
        res = [item for item in res if item["crop_name"].lower() == crop_filter.lower()]
    if max_price:
        res = [item for item in res if item["price_per_kg"] <= max_price]
    if location_query:
        res = [item for item in res if location_query.lower() in item["location"].lower()]
    return res

def add_listing(data: Dict[str, Any]) -> Dict[str, Any]:
    new_id = f"list_{len(LISTINGS) + 1}"
    data["id"] = new_id
    data["created_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    LISTINGS.insert(0, data)
    return data

def get_farmer_by_id(farmer_id: str) -> Optional[Dict[str, Any]]:
    for u in USERS:
        if u["id"] == farmer_id and u["role"] == "farmer":
            return u
    return None

def get_buyer_by_id(buyer_id: str) -> Optional[Dict[str, Any]]:
    for u in USERS:
        if u["id"] == buyer_id and u["role"] == "buyer":
            return u
    return None

def add_buyer_requirement(req: Dict[str, Any]) -> Dict[str, Any]:
    new_id = f"req_{len(BUYER_REQUIREMENTS) + 1}"
    req["id"] = new_id
    req["created_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    req["status"] = "Active"
    req["responses_count"] = 0
    BUYER_REQUIREMENTS.insert(0, req)
    return req

def add_order(order_data: Dict[str, Any]) -> Dict[str, Any]:
    new_id = f"ORD-{1100 + len(ORDERS)}"
    order_data["id"] = new_id
    order_data["created_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    order_data["status"] = "Pending"
    order_data["tracking_steps"] = [
        {"step": "Order Placed", "time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), "completed": True},
        {"step": "Farmer Accepted", "time": "Awaiting response", "completed": False},
        {"step": "Quality Verified", "time": "Pending", "completed": False},
        {"step": "Dispatched", "time": "Pending", "completed": False},
        {"step": "Delivered", "time": "Pending", "completed": False}
    ]
    ORDERS.insert(0, order_data)

    # Add notification for farmer
    NOTIFICATIONS.insert(0, {
        "id": f"notif_{len(NOTIFICATIONS) + 1}",
        "user_id": order_data.get("farmer_id", "farmer_1"),
        "type": "Listing Alert",
        "title": "New Order Received!",
        "message": f"{order_data.get('buyer_name', 'Buyer')} requested {order_data.get('quantity_kg')} kg {order_data.get('crop_name')} (ID: {new_id}).",
        "time": "Just now",
        "read": False,
        "action_link": "/orders"
    })
    return order_data

def update_order_status(order_id: str, new_status: str) -> Optional[Dict[str, Any]]:
    for o in ORDERS:
        if o["id"] == order_id:
            o["status"] = new_status
            if new_status == "Accepted":
                for step in o["tracking_steps"]:
                    if step["step"] == "Farmer Accepted":
                        step["completed"] = True
                        step["time"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
            elif new_status == "Dispatched":
                for step in o["tracking_steps"]:
                    if step["step"] in ["Farmer Accepted", "Dispatched"]:
                        step["completed"] = True
            elif new_status == "Delivered":
                for step in o["tracking_steps"]:
                    step["completed"] = True
            return o
    return None
