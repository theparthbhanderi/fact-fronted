import axios from "axios";

const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (!envURL) return "/api/";
  
  // Ensure the URL ends with /api/
  let base = envURL.trim().replace(/\/$/, "");
  if (!base.endsWith("/api")) {
    base += "/api";
  }
  return base + "/";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

export const checkFact = async (claim) => {
  const { data } = await api.post("fact-check", { claim });
  return data;
};

export const checkFactImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.post("fact-check-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const checkFactUrl = async (url) => {
  const { data } = await api.post("fact-check-url", { url });
  return data;
};

export const translateResult = async (result, targetLang) => {
  const { data } = await api.post("translate", {
    target_language: targetLang,
    result_data: result,
  });
  return data;
};

export const getHistory = async (limit = 10) => {
  const { data } = await api.get(`history?limit=${limit}`);
  return data;
};

export const searchHistory = async (query) => {
  const { data } = await api.get(`history/search?q=${encodeURIComponent(query)}`);
  return data;
};

export const getTrendingClaims = async (limit = 10) => {
  const { data } = await api.get(`analytics/trending?limit=${limit}`);
  return data;
};

export const getFalseClaims = async (limit = 10) => {
  const { data } = await api.get(`analytics/false-claims?limit=${limit}`);
  return data;
};

export const getActivityStats = async () => {
  const { data } = await api.get(`analytics/activity`);
  return data;
};

// ==========================================
// Live News Reader Endpoints
// ==========================================

export const searchNews = async (topic) => {
  const { data } = await api.get(`/news/search?q=${encodeURIComponent(topic)}`);
  return data;
};

export const readNews = async (params) => {
  if (typeof params === "string") {
    const { data } = await api.get(`/news/read?url=${encodeURIComponent(params)}`);
    return data;
  }

  const qp = new URLSearchParams();
  qp.set("url", params?.url || "");
  if (params?.title) qp.set("title", params.title);
  if (params?.source) qp.set("source", params.source);
  if (params?.published_at) qp.set("published_at", params.published_at);
  if (params?.description) qp.set("description", params.description);

  const { data } = await api.get(`/news/read?${qp.toString()}`);
  return data;
};
