// This service handles content fetching. 
// It falls back to mock data if the API is unavailable.

const API_BASE_URL = 'http://localhost:5000/api';

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) return await response.json();
    } catch (err) {
        console.warn('API unavailable, using local patterns.');
    }

    // Mock fallback based on the spec
    return [
        { id: "self_image_identity", name: "Self-Image & Identity", themeColor: "#3AFFD8" },
        { id: "personal_values", name: "Personal Values", themeColor: "#9B5CFF" },
        { id: "fears_vulnerability", name: "Fears & Vulnerability", themeColor: "#FF3B5C" }
    ];
};

export const getQuestionsByCategory = async (categoryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/questions/${categoryId}`);
        if (response.ok) return await response.json();
    } catch (err) {
        console.warn('API unavailable, using local patterns.');
    }

    // Very basic mock fallback for UX testing
    return [
        {
            id: "mock_1",
            categoryId,
            front: "What is the biggest mask you wear in public?",
            back: "Masking often protects a perceived vulnerability, yet it also prevents the true self from being fully seen or accepted.",
            themeColor: "#3AFFD8"
        }
    ];
};
