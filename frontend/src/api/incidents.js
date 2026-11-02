
const API_URL = "http://localhost:8080/api/incidents";

export async function getIncidents(status) {
    const url = status
        ? `${API_URL}?status=${encodeURIComponent(status)}`
        : API_URL;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch incidents");
    }

    return response.json();
}

export async function createIncident(incident) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(incident),
    });

    if (!response.ok) {
        throw new Error(await response.text() || "Failed to create incident");
    }

    return response.json();
}

export async function getIncidentById(id) {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch incident details");
    }

    return response.json();
}

export async function updateIncidentStatus(id, status) {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error(await response.text() || "Failed to update incident status");
    }

    return response.json();
}

// Update incident details
export async function updateIncident(id, incident) {
    const response = await fetch(`${API_URL}/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(incident),
    });

    if (!response.ok) {
        throw new Error(await response.text() || "Failed to update incident");
    }

    return response.json();
}

// Delete an incident
export async function deleteIncident(id) {
    const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(await response.text() || "Failed to delete incident");
    }
}
