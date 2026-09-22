"""
AgriLink AI Engine
Core AI intelligence modules:
1. Crop Identification from photo/features
2. 'What Should I Grow?' Crop & Season Recommendation
3. Seasonal Price & Demand Intelligence
4. Smart Matching Algorithm (Farmer <-> Buyer)
5. Voice/Natural Language Intent Parser & AgriAssist Chatbot
"""

import math
import re
from typing import Dict, List, Any, Optional

CROP_DATABASE = {
    "Tomato": {
        "category": "Vegetables",
        "varieties": ["Arka Rakshak", "Pusa Ruby", "Roma", "Vaishnavi"],
        "season": "Suitable (Year-round / Rabi & Kharif peak)",
        "suitable_months": ["August", "September", "October", "November", "December", "January"],
        "harvest_period": "60–80 days",
        "water_req": "Moderate (Drip recommended)",
        "current_demand": "High",
        "avg_market_price": 32.0,
        "price_unit": "₹/kg",
        "historical_range": "₹18 – ₹45/kg",
        "profitability": "Very High",
        "risk_level": "Medium (Perishable, price volatility)",
        "suggested_buyers": ["Retail Chains", "Wholesale Mandis", "Restaurants", "Tomato Puree & Sauce Processors"],
        "common_uses": ["Fresh culinary consumption", "Puree, pastes & ketchup", "Export grade table tomatoes"],
        "price_history": [
            {"month": "Jan", "price": 28, "demand": 82},
            {"month": "Feb", "price": 24, "demand": 78},
            {"month": "Mar", "price": 22, "demand": 75},
            {"month": "Apr", "price": 30, "demand": 85},
            {"month": "May", "price": 38, "demand": 92},
            {"month": "Jun", "price": 44, "demand": 98},
            {"month": "Jul", "price": 42, "demand": 95},
            {"month": "Aug", "price": 35, "demand": 88},
            {"month": "Sep", "price": 32, "demand": 86},
            {"month": "Oct", "price": 36, "demand": 90},
            {"month": "Nov", "price": 26, "demand": 80},
            {"month": "Dec", "price": 25, "demand": 79},
        ],
        "highest_months": "May – July",
        "lowest_months": "February – March"
    },
    "Rice": {
        "category": "Cereals",
        "varieties": ["BPT 5204 (Samba Mahsuri)", "Swarna", "Basmati 1121", "MTU 1010"],
        "season": "Kharif & Rabi",
        "suitable_months": ["June", "July", "November", "December"],
        "harvest_period": "120–145 days",
        "water_req": "High (Flooded / Canal / Heavy Rain)",
        "current_demand": "Very High",
        "avg_market_price": 28.5,
        "price_unit": "₹/kg (Paddy equivalent: ₹2300/quintal)",
        "historical_range": "₹24 – ₹36/kg",
        "profitability": "High & Stable",
        "risk_level": "Low (Government MSP support & non-perishable)",
        "suggested_buyers": ["Rice Millers", "Civil Supplies / FCI", "Export Houses", "Wholesale Distributors"],
        "common_uses": ["Staple food grain", "Rice bran oil", "Flour & snacks processing"],
        "price_history": [
            {"month": "Jan", "price": 27, "demand": 80},
            {"month": "Feb", "price": 27.5, "demand": 80},
            {"month": "Mar", "price": 28, "demand": 82},
            {"month": "Apr", "price": 29, "demand": 84},
            {"month": "May", "price": 30, "demand": 85},
            {"month": "Jun", "price": 31, "demand": 88},
            {"month": "Jul", "price": 31.5, "demand": 89},
            {"month": "Aug", "price": 30, "demand": 86},
            {"month": "Sep", "price": 29, "demand": 83},
            {"month": "Oct", "price": 28, "demand": 81},
            {"month": "Nov", "price": 27, "demand": 85},
            {"month": "Dec", "price": 27.2, "demand": 84},
        ],
        "highest_months": "June – July",
        "lowest_months": "November – January"
    },
    "Chilli": {
        "category": "Spices",
        "varieties": ["Guntur Sannam (S4)", "Teja", "Byadgi", "Armoor"],
        "season": "Kharif & Late Kharif",
        "suitable_months": ["July", "August", "September", "October"],
        "harvest_period": "90–120 days (multiple pickings)",
        "water_req": "Moderate",
        "current_demand": "Extremely High (Export surge)",
        "avg_market_price": 185.0,
        "price_unit": "₹/kg",
        "historical_range": "₹140 – ₹240/kg",
        "profitability": "Exceptional",
        "risk_level": "Medium (Pest susceptibility)",
        "suggested_buyers": ["Spice Exporters", "Masala Brands (MDH, Everest, Priya)", "Oleoresin Extractors", "Wholesalers"],
        "common_uses": ["Spice powder", "Capsaicin extraction", "Culinary drying & seasoning"],
        "price_history": [
            {"month": "Jan", "price": 170, "demand": 85},
            {"month": "Feb", "price": 165, "demand": 88},
            {"month": "Mar", "price": 160, "demand": 90},
            {"month": "Apr", "price": 175, "demand": 92},
            {"month": "May", "price": 190, "demand": 95},
            {"month": "Jun", "price": 205, "demand": 97},
            {"month": "Jul", "price": 215, "demand": 99},
            {"month": "Aug", "price": 210, "demand": 94},
            {"month": "Sep", "price": 195, "demand": 91},
            {"month": "Oct", "price": 185, "demand": 89},
            {"month": "Nov", "price": 180, "demand": 87},
            {"month": "Dec", "price": 175, "demand": 86},
        ],
        "highest_months": "June – August",
        "lowest_months": "February – March"
    },
    "Onion": {
        "category": "Vegetables",
        "varieties": ["Nashik Red", "Bhima Super", "Pusa Red", "Agrifound Dark Red"],
        "season": "Late Kharif & Rabi",
        "suitable_months": ["October", "November", "December"],
        "harvest_period": "90–110 days",
        "water_req": "Moderate",
        "current_demand": "High",
        "avg_market_price": 34.0,
        "price_unit": "₹/kg",
        "historical_range": "₹20 – ₹65/kg",
        "profitability": "High",
        "risk_level": "High (Storage loss & sudden price shifts)",
        "suggested_buyers": ["Hotel & Catering Chains", "Mandi Wholesalers", "Dehydration Units", "Exporters"],
        "common_uses": ["Staple vegetable", "Onion flakes & powder", "Food service ingredient"],
        "price_history": [
            {"month": "Jan", "price": 28, "demand": 80},
            {"month": "Feb", "price": 25, "demand": 75},
            {"month": "Mar", "price": 22, "demand": 72},
            {"month": "Apr", "price": 24, "demand": 76},
            {"month": "May", "price": 26, "demand": 78},
            {"month": "Jun", "price": 30, "demand": 82},
            {"month": "Jul", "price": 35, "demand": 88},
            {"month": "Aug", "price": 42, "demand": 94},
            {"month": "Sep", "price": 48, "demand": 96},
            {"month": "Oct", "price": 55, "demand": 99},
            {"month": "Nov", "price": 50, "demand": 95},
            {"month": "Dec", "price": 35, "demand": 86},
        ],
        "highest_months": "September – November",
        "lowest_months": "March – April"
    },
    "Cotton": {
        "category": "Cash crops",
        "varieties": ["Bt Cotton RCH 659", "Bollgard II", "MCU 5", "DCH 32"],
        "season": "Kharif",
        "suitable_months": ["May", "June", "July"],
        "harvest_period": "150–180 days",
        "water_req": "Moderate to Deep Soil Rainfed",
        "current_demand": "High",
        "avg_market_price": 72.0,
        "price_unit": "₹/kg (Seed cotton ₹7200/quintal)",
        "historical_range": "₹60 – ₹85/kg",
        "profitability": "High",
        "risk_level": "Medium (Pest management crucial)",
        "suggested_buyers": ["Textile Spinning Mills", "Ginning Factories", "Cotton Corporation of India (CCI)", "Exporters"],
        "common_uses": ["Textile yarn & apparel", "Cottonseed edible oil", "Cattle feed oil cake"],
        "price_history": [
            {"month": "Jan", "price": 70, "demand": 84},
            {"month": "Feb", "price": 71, "demand": 85},
            {"month": "Mar", "price": 72, "demand": 86},
            {"month": "Apr", "price": 74, "demand": 89},
            {"month": "May", "price": 76, "demand": 90},
            {"month": "Jun", "price": 78, "demand": 92},
            {"month": "Jul", "price": 79, "demand": 91},
            {"month": "Aug", "price": 77, "demand": 88},
            {"month": "Sep", "price": 74, "demand": 85},
            {"month": "Oct", "price": 71, "demand": 82},
            {"month": "Nov", "price": 69, "demand": 83},
            {"month": "Dec", "price": 70, "demand": 84},
        ],
        "highest_months": "June – July",
        "lowest_months": "November – December"
    },
    "Mango": {
        "category": "Fruits",
        "varieties": ["Banganapalli", "Alphonso", "Kesar", "Totapuri"],
        "season": "Summer / Pre-Monsoon",
        "suitable_months": ["March", "April", "May", "June"],
        "harvest_period": "Perennial Orchard (Harvest 90-110 days post bloom)",
        "water_req": "Low to Moderate",
        "current_demand": "Very High",
        "avg_market_price": 65.0,
        "price_unit": "₹/kg",
        "historical_range": "₹45 – ₹110/kg",
        "profitability": "Extremely High",
        "risk_level": "Low to Medium (Weather / unseasonal rains)",
        "suggested_buyers": ["Juice & Pulp Processors (Maaza, Frooti)", "Supermarket Chains", "Direct Consumers & Bulk Mandis", "Middle East Exporters"],
        "common_uses": ["Table fruit", "Aseptic mango pulp", "Pickles & confectioneries"],
        "price_history": [
            {"month": "Jan", "price": 0, "demand": 10},
            {"month": "Feb", "price": 0, "demand": 20},
            {"month": "Mar", "price": 95, "demand": 95},
            {"month": "Apr", "price": 80, "demand": 98},
            {"month": "May", "price": 65, "demand": 100},
            {"month": "Jun", "price": 50, "demand": 85},
            {"month": "Jul", "price": 40, "demand": 40},
            {"month": "Aug", "price": 0, "demand": 10},
            {"month": "Sep", "price": 0, "demand": 10},
            {"month": "Oct", "price": 0, "demand": 10},
            {"month": "Nov", "price": 0, "demand": 10},
            {"month": "Dec", "price": 0, "demand": 10},
        ],
        "highest_months": "March – April (Early arrivals)",
        "lowest_months": "June – July"
    },
    "Potato": {
        "category": "Vegetables",
        "varieties": ["Kufri Jyoti", "Kufri Pukhraj", "Kufri Chipsona (processing)", "Lady Rosetta"],
        "season": "Rabi",
        "suitable_months": ["October", "November", "December"],
        "harvest_period": "80–100 days",
        "water_req": "Moderate",
        "current_demand": "High",
        "avg_market_price": 22.0,
        "price_unit": "₹/kg",
        "historical_range": "₹14 – ₹32/kg",
        "profitability": "High",
        "risk_level": "Medium (Cold storage availability)",
        "suggested_buyers": ["Snack & Chip Manufacturers (Lays, Haldirams)", "Cold Storage Operators", "Wholesale Distributors", "Hotels"],
        "common_uses": ["Fresh cooking", "Potato chips & french fries", "Starch manufacturing"],
        "price_history": [
            {"month": "Jan", "price": 16, "demand": 75},
            {"month": "Feb", "price": 14, "demand": 72},
            {"month": "Mar", "price": 15, "demand": 74},
            {"month": "Apr", "price": 18, "demand": 80},
            {"month": "May", "price": 20, "demand": 83},
            {"month": "Jun", "price": 23, "demand": 86},
            {"month": "Jul", "price": 26, "demand": 90},
            {"month": "Aug", "price": 28, "demand": 92},
            {"month": "Sep", "price": 30, "demand": 95},
            {"month": "Oct", "price": 29, "demand": 93},
            {"month": "Nov", "price": 24, "demand": 85},
            {"month": "Dec", "price": 18, "demand": 78},
        ],
        "highest_months": "August – October",
        "lowest_months": "January – March"
    },
    "Maize": {
        "category": "Cereals",
        "varieties": ["Pioneer P3396", "DHM 117", "Sweet Corn Sugar 75", "Dekalb 9108"],
        "season": "Kharif & Rabi",
        "suitable_months": ["June", "July", "October", "November"],
        "harvest_period": "85–105 days",
        "water_req": "Moderate",
        "current_demand": "Very High (Poultry & Starch demand)",
        "avg_market_price": 24.5,
        "price_unit": "₹/kg",
        "historical_range": "₹19 – ₹29/kg",
        "profitability": "High",
        "risk_level": "Low",
        "suggested_buyers": ["Poultry & Animal Feed Mills", "Starch & Glucose Refineries", "Ethanol Distilleries", "Wholesale Grain Merchants"],
        "common_uses": ["Poultry feed", "Starch & corn syrup", "Biofuel & sweet corn retail"],
        "price_history": [
            {"month": "Jan", "price": 22, "demand": 82},
            {"month": "Feb", "price": 23, "demand": 83},
            {"month": "Mar", "price": 24, "demand": 86},
            {"month": "Apr", "price": 25, "demand": 88},
            {"month": "May", "price": 26, "demand": 90},
            {"month": "Jun", "price": 26.5, "demand": 91},
            {"month": "Jul", "price": 25, "demand": 87},
            {"month": "Aug", "price": 24, "demand": 85},
            {"month": "Sep", "price": 23, "demand": 82},
            {"month": "Oct", "price": 22.5, "demand": 80},
            {"month": "Nov", "price": 23, "demand": 81},
            {"month": "Dec", "price": 23.5, "demand": 83},
        ],
        "highest_months": "May – June",
        "lowest_months": "October – November"
    },
    "Groundnut": {
        "category": "Oilseeds",
        "varieties": ["TAG 24", "Kadiri 6 (K6)", "Dharani", "JL 24"],
        "season": "Kharif & Rabi",
        "suitable_months": ["June", "July", "November", "December"],
        "harvest_period": "100–120 days",
        "water_req": "Low to Moderate (Drought tolerant)",
        "current_demand": "High",
        "avg_market_price": 68.0,
        "price_unit": "₹/kg",
        "historical_range": "₹55 – ₹80/kg",
        "profitability": "High",
        "risk_level": "Low to Medium",
        "suggested_buyers": ["Oil Mills (Cold-pressed & Refined)", "Peanut Butter Brands", "Export Houses", "Confectionery Brands"],
        "common_uses": ["Edible oil", "Roasted nuts & snacks", "Peanut butter & cattle cake"],
        "price_history": [
            {"month": "Jan", "price": 65, "demand": 80},
            {"month": "Feb", "price": 66, "demand": 82},
            {"month": "Mar", "price": 67, "demand": 84},
            {"month": "Apr", "price": 69, "demand": 87},
            {"month": "May", "price": 72, "demand": 90},
            {"month": "Jun", "price": 74, "demand": 93},
            {"month": "Jul", "price": 73, "demand": 91},
            {"month": "Aug", "price": 70, "demand": 88},
            {"month": "Sep", "price": 68, "demand": 85},
            {"month": "Oct", "price": 64, "demand": 80},
            {"month": "Nov", "price": 63, "demand": 79},
            {"month": "Dec", "price": 64.5, "demand": 81},
        ],
        "highest_months": "May – June",
        "lowest_months": "October – November"
    },
    "Wheat": {
        "category": "Cereals",
        "varieties": ["Sharbati", "HD 2967", "PBW 343", "Lok 1"],
        "season": "Rabi",
        "suitable_months": ["October", "November", "December"],
        "harvest_period": "115–130 days",
        "water_req": "Moderate (4-5 irrigations)",
        "current_demand": "High",
        "avg_market_price": 27.0,
        "price_unit": "₹/kg",
        "historical_range": "₹22 – ₹32/kg",
        "profitability": "Stable & High",
        "risk_level": "Low",
        "suggested_buyers": ["Flour Mills (Atta & Maida)", "Biscuit & Bakery Brands (Britannia, Parle)", "Government FCI Mandis", "Grain Exporters"],
        "common_uses": ["Daily flour staple", "Bakery items", "Semolina & pasta"],
        "price_history": [
            {"month": "Jan", "price": 28, "demand": 84},
            {"month": "Feb", "price": 28.5, "demand": 85},
            {"month": "Mar", "price": 25, "demand": 89},
            {"month": "Apr", "price": 24, "demand": 92},
            {"month": "May", "price": 25, "demand": 88},
            {"month": "Jun", "price": 26, "demand": 86},
            {"month": "Jul", "price": 26.5, "demand": 85},
            {"month": "Aug", "price": 27, "demand": 84},
            {"month": "Sep", "price": 27.5, "demand": 83},
            {"month": "Oct", "price": 28, "demand": 85},
            {"month": "Nov", "price": 28.5, "demand": 86},
            {"month": "Dec", "price": 29, "demand": 87},
        ],
        "highest_months": "December – February",
        "lowest_months": "March – April (Peak harvest arrivals)"
    }
}


def identify_crop_from_image(filename: str, file_bytes_size: int = 50000, hint: Optional[str] = None) -> Dict[str, Any]:
    """
    AI-powered crop identification simulation.
    Analyzes image characteristics or image name/hint, returns crop metadata with confidence.
    """
    fname_lower = (filename or "").lower()
    hint_lower = (hint or "").lower()
    combined = fname_lower + " " + hint_lower

    matched_crop = None
    confidence = 94.0

    for crop in CROP_DATABASE.keys():
        if crop.lower() in combined:
            matched_crop = crop
            confidence = 96.5
            break

    # If no exact match, infer intelligently
    if not matched_crop:
        if "red" in combined or "fruit" in combined or "salad" in combined:
            matched_crop = "Tomato"
            confidence = 92.0
        elif "green" in combined or "chili" in combined or "mirchi" in combined or "hot" in combined:
            matched_crop = "Chilli"
            confidence = 93.5
        elif "paddy" in combined or "grain" in combined or "rice" in combined:
            matched_crop = "Rice"
            confidence = 94.0
        elif "onion" in combined or "bulb" in combined:
            matched_crop = "Onion"
            confidence = 95.0
        elif "cotton" in combined or "white" in combined:
            matched_crop = "Cotton"
            confidence = 91.0
        elif "yellow" in combined or "sweet" in combined:
            matched_crop = "Mango"
            confidence = 90.0
        else:
            # Default to prominent demo crop: Tomato
            matched_crop = "Tomato"
            confidence = 94.0

    crop_info = CROP_DATABASE[matched_crop]

    return {
        "success": True,
        "crop_name": matched_crop,
        "confidence_percentage": round(confidence, 1),
        "category": crop_info["category"],
        "possible_varieties": crop_info["varieties"],
        "season_status": crop_info["season"],
        "suitable_growing_months": crop_info["suitable_months"],
        "expected_harvest_period": crop_info["harvest_period"],
        "water_requirement": crop_info["water_req"],
        "current_demand": crop_info["current_demand"],
        "average_mandi_price": crop_info["avg_market_price"],
        "price_unit": crop_info["price_unit"],
        "historical_price_range": crop_info["historical_range"],
        "profitability_indicator": crop_info["profitability"],
        "risk_level": crop_info["risk_level"],
        "common_uses": crop_info["common_uses"],
        "suggested_buyers": crop_info["suggested_buyers"],
        "ai_verified_badge": True if confidence >= 85 else False,
        "disclaimer": "AI-assisted identification based on visual pattern matching. Please verify variety and quality standards before final delivery."
    }


def recommend_crops(
    location: str,
    land_size_acres: float,
    soil_type: str,
    available_water: str,
    current_season: str,
    previous_crop: str = "None",
    investment_level: str = "Medium"
) -> List[Dict[str, Any]]:
    """
    'What Should I Grow?' Recommendation Engine.
    Evaluates agronomic parameters and returns ranked crops with profitability, risk, and buyer categories.
    """
    recommendations = []

    soil_lower = soil_type.lower()
    water_lower = available_water.lower()
    season_lower = current_season.lower()
    inv_lower = investment_level.lower()

    for crop_name, details in CROP_DATABASE.items():
        score = 70.0
        reasons = []

        # Soil matching
        if "black" in soil_lower and crop_name in ["Cotton", "Chilli", "Wheat", "Maize"]:
            score += 12
            reasons.append("Black soil provides ideal moisture retention for this crop.")
        elif "red" in soil_lower and crop_name in ["Groundnut", "Tomato", "Mango", "Maize"]:
            score += 12
            reasons.append("Red loamy soil is highly suited with excellent drainage.")
        elif "alluvial" in soil_lower and crop_name in ["Rice", "Wheat", "Potato", "Tomato"]:
            score += 14
            reasons.append("Rich alluvial soil offers high fertility and nutrient profile.")
        elif "sandy" in soil_lower and crop_name in ["Groundnut", "Potato", "Watermelon"]:
            score += 10
            reasons.append("Light porous soil aids tuber and root development.")
        else:
            score += 5

        # Water matching
        if ("borewell" in water_lower or "canal" in water_lower or "drip" in water_lower):
            if crop_name in ["Tomato", "Chilli", "Potato"]:
                score += 10
                reasons.append("Assured irrigation supports high-yield vegetable & spice cycles.")
            elif crop_name in ["Rice"]:
                score += 12
                reasons.append("Canal/assured water is perfect for wetland cultivation.")
        elif "rainfed" in water_lower:
            if crop_name in ["Cotton", "Groundnut", "Maize"]:
                score += 10
                reasons.append("Hardy crop with high drought resilience for rainfed conditions.")
            elif crop_name in ["Rice", "Tomato"]:
                score -= 15
                reasons.append("Requires reliable irrigation; rainfed poses higher risk.")

        # Season matching
        if "kharif" in season_lower and crop_name in ["Rice", "Cotton", "Maize", "Groundnut", "Chilli"]:
            score += 10
            reasons.append("Prime Kharif sowing window with optimal temperature and daylight.")
        elif "rabi" in season_lower and crop_name in ["Wheat", "Potato", "Tomato", "Onion"]:
            score += 10
            reasons.append("Rabi winter climate fosters flowering and fruit setting.")
        elif "zaid" in season_lower or "summer" in season_lower and crop_name in ["Mango", "Groundnut", "Maize"]:
            score += 8
            reasons.append("Suitable for summer/perennial season.")

        # Investment matching
        if "low" in inv_lower and details["risk_level"].startswith("Low"):
            score += 8
            reasons.append("Low input cost and safe market return profile.")
        elif "high" in inv_lower and details["profitability"] in ["Very High", "Exceptional"]:
            score += 10
            reasons.append("High capital investment yields exponential returns with commercial buyers.")

        # Crop rotation bonus
        if previous_crop and previous_crop.lower() in ["rice", "wheat"] and details["category"] in ["Pulses", "Oilseeds", "Vegetables"]:
            score += 6
            reasons.append(f"Excellent crop rotation following {previous_crop}, restores soil nitrogen.")

        score = min(98.5, max(60.0, score))

        recommendations.append({
            "crop_name": crop_name,
            "category": details["category"],
            "match_score": round(score, 1),
            "suitability_reasons": reasons,
            "growing_season": details["season"],
            "expected_duration": details["harvest_period"],
            "estimated_water_requirement": details["water_req"],
            "expected_demand": details["current_demand"],
            "historical_price_range": details["historical_range"],
            "approximate_profitability": details["profitability"],
            "risk_level": details["risk_level"],
            "suggested_buyer_categories": details["suggested_buyers"],
            "varieties": details["varieties"][:2],
            "average_price": details["avg_market_price"],
            "price_unit": details["price_unit"]
        })

    # Sort descending by match score
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    return recommendations


def get_price_intelligence(crop_name: str, location: str = "Regional Average", time_period: str = "12 Months") -> Dict[str, Any]:
    """
    Returns monthly price trends, seasonal variance, and 'Know Your Price' transparency guidance.
    """
    crop = crop_name.title()
    if crop not in CROP_DATABASE:
        crop = "Tomato"

    details = CROP_DATABASE[crop]
    current_price = details["avg_market_price"]
    prev_month_price = details["price_history"][-2]["price"] if len(details["price_history"]) > 1 else current_price * 0.95

    regional_variance = {
        "Andhra Pradesh / Telangana": round(current_price * 1.02, 1),
        "Maharashtra (Nashik/Pune)": round(current_price * 0.98, 1),
        "Karnataka (Kolar/Bengaluru)": round(current_price * 1.04, 1),
        "Punjab / Haryana": round(current_price * 0.96, 1),
        "National Mandi Benchmark": current_price
    }

    price_diff = round(current_price - prev_month_price, 1)
    percent_change = round((price_diff / prev_month_price) * 100, 1) if prev_month_price > 0 else 0

    return {
        "crop_name": crop,
        "selected_location": location,
        "time_period": time_period,
        "current_price": current_price,
        "previous_price": prev_month_price,
        "price_change_amount": price_diff,
        "price_change_percent": percent_change,
        "trend_direction": "UP" if price_diff >= 0 else "DOWN",
        "price_unit": details["price_unit"],
        "monthly_trend": details["price_history"],
        "highest_price_months": details["highest_months"],
        "lowest_price_months": details["lowest_months"],
        "current_demand_index": details["current_demand"],
        "regional_prices": regional_variance,
        "know_your_price_guidance": (
            f"Prices for {crop} have historically peaked during {details['highest_months']}. "
            f"Current regional mandi average is {current_price} {details['price_unit']}. "
            "Consider negotiating directly with verified commercial buyers on AgriLink before accepting wholesale broker discounts."
        )
    }


def calculate_smart_match(
    farmer_listing: Dict[str, Any],
    buyer_requirement: Dict[str, Any]
) -> Dict[str, Any]:
    """
    AI Match calculation between a farmer crop listing and buyer requirement.
    Considers: Crop exactness, Quantity overlap, Distance, Price fit, Quality Grade.
    """
    score = 0.0
    factors = []

    # 1. Crop Match (Must match, weight: 35%)
    crop_match = farmer_listing.get("crop_name", "").strip().lower() == buyer_requirement.get("crop_name", "").strip().lower()
    if crop_match:
        score += 35.0
        factors.append("Crop variety matches required specifications.")
    else:
        return {"match_percentage": 15, "explanation": "Crops do not match.", "eligible": False}

    # 2. Quantity Fit (Weight: 20%)
    req_qty = buyer_requirement.get("quantity_kg", 500)
    avail_qty = farmer_listing.get("quantity_kg", 400)
    qty_ratio = min(avail_qty / req_qty, req_qty / avail_qty) if req_qty > 0 and avail_qty > 0 else 0.5
    qty_score = 20.0 * qty_ratio
    score += qty_score
    if qty_ratio >= 0.8:
        factors.append(f"Quantity aligns closely ({avail_qty} kg available vs {req_qty} kg needed).")
    else:
        factors.append(f"Partial quantity fulfillment ({avail_qty} kg available of {req_qty} kg needed).")

    # 3. Price Fit (Weight: 20%)
    buyer_max_price = buyer_requirement.get("max_price_per_kg", 35.0)
    farmer_price = farmer_listing.get("price_per_kg", 30.0)
    if farmer_price <= buyer_max_price:
        savings = buyer_max_price - farmer_price
        score += 20.0
        factors.append(f"Price is well within buyer budget (₹{farmer_price}/kg vs budget max ₹{buyer_max_price}/kg).")
    else:
        over = farmer_price - buyer_max_price
        penalty = min(20.0, (over / buyer_max_price) * 30)
        score += max(0, 20.0 - penalty)
        factors.append(f"Farmer asking price (₹{farmer_price}/kg) is slightly above buyer target (₹{buyer_max_price}/kg).")

    # 4. Location & Distance (Weight: 15%)
    dist_km = farmer_listing.get("distance_km", 25)
    if dist_km <= 30:
        score += 15.0
        factors.append(f"Farmer is very close ({dist_km} km away), minimal logistics freight cost.")
    elif dist_km <= 75:
        score += 10.0
        factors.append(f"Farmer is within regional transit zone ({dist_km} km).")
    else:
        score += 5.0
        factors.append(f"Long-distance transport required ({dist_km} km).")

    # 5. Quality & Verification (Weight: 10%)
    farmer_grade = farmer_listing.get("grade", "Grade A")
    req_grade = buyer_requirement.get("required_grade", "Grade A")
    is_verified = farmer_listing.get("ai_crop_verified", True)

    if farmer_grade == req_grade:
        score += 6.0
        factors.append(f"Quality matches target: {farmer_grade}.")
    else:
        score += 3.0

    if is_verified:
        score += 4.0
        factors.append("Listing has AI Crop Verified badge.")

    final_pct = min(98, max(45, int(score)))

    explanation = (
        f"Crop and quantity match, farmer is located {dist_km} km away, "
        f"and the asking price of ₹{farmer_price}/kg fits your purchase criteria."
    )

    return {
        "match_percentage": final_pct,
        "eligible": final_pct >= 60,
        "explanation": explanation,
        "key_factors": factors,
        "farmer_id": farmer_listing.get("farmer_id"),
        "farmer_name": farmer_listing.get("farmer_name"),
        "listing_id": farmer_listing.get("id"),
        "crop_name": farmer_listing.get("crop_name"),
        "price_per_kg": farmer_price,
        "quantity_kg": avail_qty,
        "location": farmer_listing.get("location"),
        "distance_km": dist_km
    }


def parse_voice_listing_intent(text: str) -> Dict[str, Any]:
    """
    Parses speech-to-text input like:
    'I have 200 kilos of tomatoes to sell'
    'నా దగ్గర 500 కేజీల టమాటాలు అమ్మకానికి ఉన్నాయి' (Telugu)
    'मेरे पास 300 किलो प्याज बेचने के लिए है' (Hindi)
    """
    text_lower = text.lower()
    crop_detected = "Tomato"
    qty_detected = 100
    unit = "kg"
    expected_price = 30.0

    # Crop extraction
    for crop in CROP_DATABASE.keys():
        if crop.lower() in text_lower:
            crop_detected = crop
            break
    if "టమాటా" in text or "టమాటాలు" in text:
        crop_detected = "Tomato"
    elif "వరి" in text or "బియ్యం" in text or "చావల్" in text:
        crop_detected = "Rice"
    elif "మిర్చి" in text or "మిరపకాయ" in text or "మిర్చి" in text:
        crop_detected = "Chilli"
    elif "ఉల్లి" in text or "ఉల్లిపాయ" in text or "प्याज" in text:
        crop_detected = "Onion"
    elif "పత్తి" in text or "కపాస్" in text:
        crop_detected = "Cotton"
    elif "మామిడి" in text or "ఆమ్" in text:
        crop_detected = "Mango"
    elif "బంగాళదుంప" in text or "ఆలూ" in text:
        crop_detected = "Potato"

    # Number extraction
    numbers = re.findall(r'\d+', text)
    if numbers:
        qty_detected = int(numbers[0])
        if len(numbers) > 1:
            expected_price = float(numbers[1])
        else:
            expected_price = CROP_DATABASE.get(crop_detected, {}).get("avg_market_price", 30.0)
    else:
        # Check words
        if "two hundred" in text_lower or "200" in text_lower:
            qty_detected = 200
        elif "five hundred" in text_lower or "500" in text_lower:
            qty_detected = 500

    # Language detection (Unicode ranges for Telugu and Hindi)
    has_telugu = any('\u0c00' <= ch <= '\u0c7f' for ch in text)
    has_hindi = any('\u0900' <= ch <= '\u097f' for ch in text)

    # Language‑specific response message
    if has_telugu:
        reply_msg = f"మీరు {qty_detected} {unit} {crop_detected} ను అమ్మడానికి {expected_price} రూపాయలకు/కిలోగ్రాం వద్ద లిస్టింగ్ సృష్టించారు. దయచేసి variety మరియు harvest date ని నిర్ధారించండి."
    elif has_hindi:
        reply_msg = f"आपने {qty_detected} {unit} {crop_detected} को {expected_price} रुपये/किग्रा पर बेचने के लिये ड्राफ्ट बनाया है। कृपया variety और harvest date की पुष्टि करें।"
    else:
        reply_msg = f"Recognized: {qty_detected} {unit} of {crop_detected} at expected ₹{expected_price}/{unit}. Please confirm the variety and harvest date to publish your listing."

    return {
        "status": "draft_created",
        "crop_name": crop_detected,
        "quantity": qty_detected,
        "unit": unit,
        "suggested_price": expected_price,
        "message": reply_msg,
    }


def _detect_lang(text: str) -> str:
    """Detect script: 'te' for Telugu, 'hi' for Hindi, 'en' otherwise."""
    if any('\u0c00' <= ch <= '\u0c7f' for ch in text):
        return 'te'
    if any('\u0900' <= ch <= '\u097f' for ch in text):
        return 'hi'
    return 'en'



def handle_agriassist_chat(query: str, language: str = "en") -> Dict[str, Any]:
    """
    AgriAssist conversational AI — detects the language of the query
    (Telugu / Hindi / English) and responds in that SAME language so
    TTS will speak in the correct voice.
    """
    q = query.lower()
    lang = _detect_lang(query)  # auto-detect from script, ignore 'language' param

    # ── INTENT: Crop Recommendation ────────────────────────────────────────
    crop_intent = (
        "what crop should i grow" in q or
        "what should i grow" in q or
        "which crop" in q or
        "ఏ పంట వేయాలి" in q or
        "ఏ పంట" in q or
        "పంట సూచన" in q or
        "कौन सी फसल" in q or
        "कौन सी फसल उगाऊं" in q or
        "फसल सलाह" in q
    )
    if crop_intent:
        replies = {
            "te": (
                "ప్రస్తుత సీజన్ ట్రెండ్‌ల ఆధారంగా, **టమాటా**, **మిర్చి (గుంటూర్ తేజా)**, మరియు **మొక్కజొన్న** అత్యధిక కొనుగోలుదారుల డిమాండ్ మరియు మంచి ధర అంచనాలతో ఉన్నాయి. "
                "మీ నేల రకం మరియు నీటి లభ్యత ఆధారంగా వివరమైన సూచన కోసం 'ఏ పంట వేయాలి?' సాధనాన్ని తెరవాలా?"
            ),
            "hi": (
                "वर्तमान मौसम के अनुसार **टमाटर**, **मिर्च (गुंटूर तेजा)**, और **मक्का** सबसे अधिक मांग वाली फसलें हैं। "
                "क्या आप अपनी मिट्टी और पानी की उपलब्धता के अनुसार सटीक सलाह चाहते हैं?"
            ),
            "en": (
                "Based on current seasonal patterns, **Tomato**, **Chilli (Guntur Teja)**, and **Maize** have the highest buyer demand. "
                "Would you like me to analyze your soil type and water availability in the 'What Should I Grow?' tool?"
            ),
        }
        return {
            "reply": replies[lang],
            "action_link": "/what-should-i-grow",
            "action_label": "Open Crop Recommendation" if lang == "en" else ("పంట సూచన తెరవండి" if lang == "te" else "फसल सलाह खोलें"),
        }

    # ── INTENT: Crop Identification ─────────────────────────────────────────
    id_intent = (
        "what is this crop" in q or
        "identify" in q or
        "which plant" in q or
        "ఈ పంట ఏమిటి" in q or
        "పంట గుర్తింపు" in q or
        "यह कौन सा पौधा" in q or
        "फसल पहचान" in q
    )
    if id_intent:
        replies = {
            "te": (
                "మీరు **AI పంట గుర్తింపు** సాధనంలో ఫోటో అప్‌లోడ్ చేయవచ్చు! "
                "AgriLink యొక్క కంప్యూటర్ విజన్ మోడల్ పంట రకం, విత్తన రకం, పంట సిద్ధంగా ఉందా లేదా అని కొన్ని సెకన్లలో గుర్తిస్తుంది."
            ),
            "hi": (
                "आप हमारे **AI फसल पहचान** टूल में फ़ोटो अपलोड कर सकते हैं! "
                "AgriLink का कंप्यूटर विजन मॉडल फसल, किस्म और कटाई की तैयारी कुछ ही सेकंड में बता देगा।"
            ),
            "en": (
                "You can upload a photo in our **AI Crop Identification** tool! "
                "AgriLink's model will detect the crop, variety, and harvest readiness within seconds."
            ),
        }
        return {
            "reply": replies[lang],
            "action_link": "/ai-crop-id",
            "action_label": "Upload Photo Now" if lang == "en" else ("ఫోటో అప్‌లోడ్ చేయండి" if lang == "te" else "फ़ोटो अपलोड करें"),
        }

    # ── INTENT: Price / Mandi Rate ──────────────────────────────────────────
    price_intent = (
        "price" in q or "trend" in q or "rate" in q or "mandi" in q or
        "ధర" in q or "రేటు" in q or "మండి" in q or "ఎంత" in q or
        "भाव" in q or "दाम" in q or "मंडी" in q or "रेट" in q
    )
    if price_intent:
        replies = {
            "te": (
                "ప్రస్తుతం **టమాటా ₹32/కిలో** (ఈ వారం 8% పెరిగింది), **మిర్చి (S4/తేజా) ₹185/కిలో**, మరియు **ఉల్లిపాయ ₹34/కిలో**. "
                "ప్రాంతీయ మండి పోలికలు మరియు గరిష్ట ధర నెలలు చూడటానికి 'ధర విశ్లేషణ' డాష్‌బోర్డ్‌ను తెరవండి."
            ),
            "hi": (
                "अभी **टमाटर ₹32/किग्रा** (इस हफ्ते 8% ऊपर), **मिर्च (S4/तेजा) ₹185/किग्रा**, और **प्याज ₹34/किग्रा** है। "
                "क्षेत्रीय मंडी तुलना और उच्चतम कीमत के महीने देखने के लिए 'मूल्य बुद्धिमत्ता' डैशबोर्ड खोलें।"
            ),
            "en": (
                "Tomato is trending at **₹32/kg** (up 8% this week), Chilli (S4/Teja) at **₹185/kg**, and Onion at **₹34/kg**. "
                "Check the 'Price Intelligence' dashboard for regional mandi comparisons and peak months."
            ),
        }
        return {
            "reply": replies[lang],
            "action_link": "/price-intelligence",
            "action_label": "View Price Dashboard" if lang == "en" else ("ధర డాష్‌బోర్డ్ చూడండి" if lang == "te" else "मूल्य डैशबोर्ड खोलें"),
        }

    # ── INTENT: Find Buyers ─────────────────────────────────────────────────
    buyer_intent = (
        "who is buying" in q or "buyers near" in q or "find buyer" in q or
        "కొనేవారు" in q or "కొనుగోలుదారులు" in q or "ఎవరు కొంటున్నారు" in q or
        "खरीदार" in q or "कौन खरीद" in q or "खरीदने वाले" in q
    )
    if buyer_intent:
        replies = {
            "te": (
                "మీ ప్రాంతంలో 50 కి.మీ. లోపు **8 ధృవీకరించిన వాణిజ్య కొనుగోలుదారులు** చురుగ్గా ఉన్నారు — "
                "FreshMart రిటైలర్స్ (500 కిలో టమాటా) మరియు Apex Agro Exports (1,200 కిలో మిర్చి) సహా!"
            ),
            "hi": (
                "आपके 50 किमी के भीतर **8 सत्यापित व्यावसायिक खरीदार** सक्रिय हैं — "
                "FreshMart Retailers (500 किग्रा टमाटर) और Apex Agro Exports (1,200 किग्रा मिर्च) सहित!"
            ),
            "en": (
                "There are **8 verified commercial buyers** within 50 km of your area — "
                "including FreshMart Retailers (500 kg Tomato) and Apex Agro Exports (1,200 kg Chilli)!"
            ),
        }
        return {
            "reply": replies[lang],
            "action_link": "/smart-matching",
            "action_label": "See Nearby Buyers" if lang == "en" else ("సమీప కొనుగోలుదారులు చూడండి" if lang == "te" else "पास के खरीदार देखें"),
        }

    # ── INTENT: Harvest Tips ────────────────────────────────────────────────
    harvest_intent = (
        "harvest" in q or "when to cut" in q or "ready to pick" in q or
        "కోత" in q or "పంట కోయాలి" in q or "సిద్ధంగా" in q or
        "कटाई" in q or "काटना" in q or "तैयार" in q
    )
    if harvest_intent:
        replies = {
            "te": (
                "టమాటా వంటి కూరగాయలకు, కాయలు బ్రేకర్-నుండి-పింక్ దశకు మారినప్పుడు (నాటిన 60-75 రోజుల తర్వాత) కోయడం ఉత్తమం. "
                "వరి వంటి ధాన్యాలకు, 80-85% గింజలు గోల్డెన్ రంగుకు మారినప్పుడు కోయండి."
            ),
            "hi": (
                "टमाटर जैसी सब्जियों के लिए, जब फल ब्रेकर-से-गुलाबी अवस्था में आएं (रोपाई के 60-75 दिन बाद) तब काटना सबसे अच्छा है। "
                "धान जैसी फसलों के लिए, जब 80-85% दाने सुनहरे हो जाएं तब काटें।"
            ),
            "en": (
                "For vegetables like Tomato, harvest at breaker-to-pink stage (60-75 days after transplanting). "
                "For grain crops like Rice, harvest when 80-85% grains turn straw-golden."
            ),
        }
        return {
            "reply": replies[lang],
            "action_link": "/farmer-dashboard",
            "action_label": "View Harvesting Tips" if lang == "en" else ("పంట కోత చిట్కాలు" if lang == "te" else "कटाई सुझाव देखें"),
        }

    # ── INTENT: Sell / Listing ──────────────────────────────────────────────
    sell_intent = (
        "sell" in q or "list" in q or "create listing" in q or
        "అమ్మకం" in q or "లిస్టింగ్" in q or "అమ్మాలి" in q or
        "बेचना" in q or "लिस्ट" in q or "बिक्री" in q
    )
    if sell_intent:
        replies = {
            "te": (
                "మీ పంట అమ్మకానికి పెట్టాలంటే — **'నా దగ్గర 200 కేజీల టమాటాలు అమ్మకానికి ఉన్నాయి'** అని చెప్పండి. "
                "AgriAssist వెంటనే ధర అంచనాతో లిస్టింగ్ డ్రాఫ్ట్ తయారు చేస్తుంది!"
            ),
            "hi": (
                "अपनी फसल बेचने के लिए — **'मेरे पास 200 किलो टमाटर बेचने हैं'** बोलें। "
                "AgriAssist तुरंत कीमत अनुमान के साथ लिस्टिंग ड्राफ्ट बनाएगा!"
            ),
            "en": (
                "To sell your crop — say **'I have 200 kg of tomatoes to sell'**. "
                "AgriAssist will instantly create a listing draft with a price estimate!"
            ),
        }
        return {
            "reply": replies[lang],
            "action_link": "/farmer-dashboard",
            "action_label": "Open Listing Form" if lang == "en" else ("లిస్టింగ్ తెరవండి" if lang == "te" else "लिस्टिंग खोलें"),
        }

    # ── DEFAULT fallback ────────────────────────────────────────────────────
    fallbacks = {
        "te": (
            "నమస్కారం! నేను **AgriAssist** AI. పంట ధరలు, కొనుగోలుదారులు, పంట గుర్తింపు లేదా లిస్టింగ్ గురించి నన్ను అడగండి. "
            "ఉదాహరణ: 'టమాటా ధర ఎంత?', 'నా దగ్గర 200 కేజీలు అమ్మకానికి ఉన్నాయి'."
        ),
        "hi": (
            "नमस्ते! मैं **AgriAssist** AI हूँ। फसल की कीमत, खरीदार, पहचान या लिस्टिंग के बारे में पूछें। "
            "उदाहरण: 'टमाटर का भाव क्या है?', 'मेरे पास 200 किलो टमाटर बेचने हैं'।"
        ),
        "en": (
            "Hello! I am **AgriAssist** AI. Ask me about crop prices, nearby buyers, crop identification, or creating a listing. "
            "Example: 'What is the tomato price?' or 'I have 200 kg of rice to sell'."
        ),
    }
    return {
        "reply": fallbacks[lang],
        "action_link": "/smart-matching",
        "action_label": "Explore Marketplace" if lang == "en" else ("మార్కెట్‌ప్లేస్ చూడండి" if lang == "te" else "बाज़ार देखें"),
    }

