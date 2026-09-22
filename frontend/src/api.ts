const API_BASE = "http://127.0.0.1:8000/api";

export async function fetchJson(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Falling back or error fetching ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Crops
  getCrops: () => fetchJson("/crops"),

  // AI Crop Identification
  identifyCrop: async (file?: File, hint?: string) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (hint) {
      formData.append("crop_hint", hint);
    }
    const res = await fetch(`${API_BASE}/ai/identify`, {
      method: "POST",
      body: formData
    });
    return res.json();
  },

  // "What Should I Grow?"
  getRecommendations: (data: any) =>
    fetchJson("/ai/recommend", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  // Price Intelligence
  getPriceTrends: (crop: string = "Tomato", location: string = "Rajahmundry", period: string = "12 Months") =>
    fetchJson(`/ai/price-trends?crop=${encodeURIComponent(crop)}&location=${encodeURIComponent(location)}&period=${encodeURIComponent(period)}`),

  // Smart Matching
  getSmartMatches: () => fetchJson("/ai/smart-matches"),

  // AgriAssist Chatbot
  chatWithAgriAssist: (query: string, language: string = "en") =>
    fetchJson("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ query, language })
    }),

  // Voice Intent Parser
  parseVoice: (text: string) =>
    fetchJson("/ai/parse-voice", {
      method: "POST",
      body: JSON.stringify({ text })
    }),

  // Listings
  getListings: (params?: { crop?: string; category?: string; max_price?: number; location?: string; grade?: string }) => {
    const query = new URLSearchParams();
    if (params?.crop) query.append("crop", params.crop);
    if (params?.category) query.append("category", params.category);
    if (params?.max_price) query.append("max_price", params.max_price.toString());
    if (params?.location) query.append("location", params.location);
    if (params?.grade) query.append("grade", params.grade);
    return fetchJson(`/listings?${query.toString()}`);
  },

  createListing: (data: any) =>
    fetchJson("/listings", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  getListingDetail: (id: string) => fetchJson(`/listings/${id}`),

  // Profiles
  getFarmerProfile: (id: string) => fetchJson(`/farmers/${id}`),
  getBuyerProfile: (id: string) => fetchJson(`/buyers/${id}`),

  // Buyer Requirements
  getRequirements: (crop?: string) =>
    fetchJson(`/requirements${crop ? `?crop=${encodeURIComponent(crop)}` : ""}`),

  createRequirement: (data: any) =>
    fetchJson("/requirements", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  // Orders
  getOrders: (userId?: string, role?: string) => {
    const query = new URLSearchParams();
    if (userId) query.append("user_id", userId);
    if (role) query.append("role", role);
    return fetchJson(`/orders?${query.toString()}`);
  },

  placeOrder: (data: any) =>
    fetchJson("/orders", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateOrderStatus: (orderId: string, status: string) =>
    fetchJson(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    }),

  // Notifications
  getNotifications: (userId: string = "farmer_1") =>
    fetchJson(`/notifications?user_id=${encodeURIComponent(userId)}`),

  // Admin
  getAdminStats: () => fetchJson("/admin/stats")
};
