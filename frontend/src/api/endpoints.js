import api from "./api";

export const getEndpoints = async () => {
    const response = await api.get("/api/endpoints");
    return response.data;
};

export const registerEndpoint = async (endpoint) => {
    const response = await api.post("/api/endpoints", endpoint);
    return response.data;
};

export const getEndpointById = async (id) => {
    const response = await api.get(`/api/endpoints/${id}`);
    return response.data;
};

export const testEndpoint = async (id) => {
    const response = await api.post(`/api/endpoints/${id}/test`);
    return response.data;
};

export const updateEndpoint = async (id, endpoint) => {
    const response = await api.put(`/api/endpoints/update/${id}`, endpoint);
    return response.data;
};

export const deleteEndpoint = async (id) => {
    await api.delete(`/api/endpoints/delete/${id}`);
};


export const getEndpointTestHistory = async (id) => {
    const response = await api.get(`/api/endpoints/${id}/history`);
    return response.data;
};