/**
 * Translation Utility
 * Uses the free Google Translate unofficial endpoint.
 * No API key required.
 */

export async function translateText(text, targetLanguage) {
  if (!text) return "";
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Google Translate splits long text into multiple array elements.
    // We join them back together to form the complete translation.
    return data[0].map((item) => item[0]).join("");
  } catch (err) {
    console.error("Translation error:", err);
    return text; // Fallback to original text
  }
}
