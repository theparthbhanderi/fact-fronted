import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 120000, // 2 min — LLM can be slow on free tier
  headers: { "Content-Type": "application/json" },
});

/**
 * Submit a claim for AI fact-checking.
 * @param {string} claim - The news claim to verify.
 * @returns {Promise<object>} Fact-check result with verdict, confidence, etc.
 */
export const checkFact = async (claim) => {
  const { data } = await api.post("/fact-check", { claim });
  return data;
};

/**
 * Submit an image screenshot for OCR text extraction and fact-checking.
 * @param {File} imageFile - The screenshot image file.
 * @returns {Promise<object>} Fact-check result based on OCR text.
 */
export const checkFactImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.post("/fact-check-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Submit a URL for article text extraction and fact-checking.
 * @param {string} url - The article URL.
 * @returns {Promise<object>} Multiple fact-check results based on the article's claims.
 */
export const checkFactUrl = async (url) => {
  const { data } = await api.post("/fact-check-url", { url }, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

/**
 * Translate a fact check result payload into the target language.
 * @param {object} result - The fact check result object.
 * @param {string} targetLang - The target language code (en, hi, gu).
 * @returns {Promise<object>} Translated fact check result.
 */
export const translateResult = async (result, targetLang) => {
  const { data } = await api.post("/translate", {
    target_language: targetLang,
    result_data: result,
  });
  return data;
};

/**
 * Fetch recent fact check history.
 * @param {number} limit 
 * @returns {Promise<Array>} Array of fact check records.
 */
export const getHistory = async (limit = 10) => {
  const { data } = await api.get(`/history?limit=${limit}`);
  return data;
};

/**
 * Search the fact check history by keyword.
 * @param {string} query 
 * @returns {Promise<Array>} Array of fact check records matching the query.
 */
export const searchHistory = async (query) => {
  const { data } = await api.get(`/history/search?q=${encodeURIComponent(query)}`);
  return data;
};

// ==========================================
// Analytics Endpoints (STEP 8)
// ==========================================

export const getTrendingClaims = async (limit = 10) => {
  const { data } = await api.get(`/analytics/trending?limit=${limit}`);
  return data;
};

export const getFalseClaims = async (limit = 10) => {
  const { data } = await api.get(`/analytics/false-claims?limit=${limit}`);
  return data;
};

export const getActivityStats = async () => {
  const { data } = await api.get(`/analytics/activity`);
  return data;
};
