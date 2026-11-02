
import api from "./api";

export const getCollections = async () => {
    const response = await api.get("/api/collections");
    return response.data;
};

export const getCollectionById = async (id) => {
    const response = await api.get(`/api/collections/${id}`);
    return response.data;
};

export const createCollection = async (data) => {
    const response = await api.post("/api/collections", data);
    return response.data;
};

export const updateCollection = async (id, data) => {
    const response = await api.put(`/api/collections/${id}`, data);
    return response.data;
};

export const deleteCollection = async (id) => {
    const response = await api.delete(`/api/collections/${id}`);
    return response.data;
};

export const runCollection = async (collectionId) => {
    const response = await api.post(
        `/api/collections/${collectionId}/run`
    );

    return response.data;
};
