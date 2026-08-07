// =====================================================
// SMART CROP ADVISORY SYSTEM - CONFIGURATION
// =====================================================

const CONFIG = {
    // API Keys (Placeholder for production)
    WEATHER_API_KEY: "",
    MARKET_API_KEY: "",
    MAP_API_KEY: "",
    OPENAI_API_KEY: "",
    GOOGLE_PLACES_API_KEY: "",

    // System Settings
    ENABLE_OFFLINE_MODE: true, // Graceful fallback when APIs are unavailable
    DEFAULT_LANGUAGE: "en",
    APP_VERSION: "2.0.0"
};

// Expose globally
window.CONFIG = CONFIG;
