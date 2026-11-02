const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProfile() {
    const response = await fetch(`${API_BASE_URL}/api/profile`);

    if (!response.ok) {
        throw new Error("Failed to fetch profile");
    }

    return response.json();
}

export async function updateProfile(profile) {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
    });

    if (!response.ok) {
        throw new Error("Failed to update profile");
    }

    return response.json();
}