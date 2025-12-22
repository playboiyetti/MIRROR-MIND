const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const mockCategories = [
    { id: "childhood_memories", name: "Childhood Memories", themeColor: "#00A5FF" },
    { id: "personal_values", name: "Personal Values", themeColor: "#9B5CFF" },
    { id: "relationships_connections", name: "Relationships & Connections", themeColor: "#FFC857" },
    { id: "career_ambitions", name: "Career & Ambitions", themeColor: "#FF8C00" },
    { id: "fears_vulnerability", name: "Fears & Vulnerability", themeColor: "#FF3B5C" },
    { id: "dreams_subconscious", name: "Dreams & Subconscious", themeColor: "#3A47FF" },
    { id: "self_image_identity", name: "Self-Image & Identity", themeColor: "#3AFFD8" },
    { id: "daily_habits_routines", name: "Daily Habits & Routines", themeColor: "#6B7280" },
    { id: "emotional_responses", name: "Emotional Responses", themeColor: "#FF00FF" },
    { id: "future_dreams_visions", name: "Future Dreams & Visions", themeColor: "#00FF00" },
    { id: "spiritual_soul_connections", name: "Spiritual & Soul Connections", themeColor: "#AF7AC5" },
    { id: "creativity_inner_expression", name: "Creativity & Inner Expression", themeColor: "#FDB813" }
];

const mockQuestions = {
    "self_image_identity": [
        {
            id: "si_1",
            categoryId: "self_image_identity",
            front: "What is the biggest mask you wear in public?",
            back: "Masking often protects a perceived vulnerability, yet it also prevents the true self from being fully seen or accepted.",
            themeColor: "#3AFFD8",
            intensity: 8
        },
        {
            id: "si_2",
            categoryId: "self_image_identity",
            front: "When do you feel most authentically yourself?",
            back: "Authentic moments reveal where we feel safe to drop our defenses and exist without performance or judgment.",
            themeColor: "#3AFFD8",
            intensity: 5
        }
    ],
    "personal_values": [
        {
            id: "pv_1",
            categoryId: "personal_values",
            front: "What value would you never compromise, no matter the cost?",
            back: "Core values form the foundation of identity. When compromised, they create internal dissonance and loss of self-trust.",
            themeColor: "#9B5CFF",
            intensity: 7
        }
    ]
};

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (err) {
        console.warn('API unavailable, using local data:', err.message);
    }
    return mockCategories;
};

export const getQuestionsByCategory = async (categoryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/questions/${categoryId}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (err) {
        console.warn('API unavailable, using local data:', err.message);
    }

    return mockQuestions[categoryId] || mockQuestions["self_image_identity"];
};
