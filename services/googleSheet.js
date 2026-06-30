const axios = require("axios");
require("dotenv").config();

/**
 * Save Lead to Google Sheet
 */
async function saveLead(data) {
  try {
    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      budget: data.budget || "",
      message: data.message || "",
      project: data.project || "",
      source: data.source || "Website",
      whatsapp: data.whatsapp || data.phone,

      utm_source: data.utm_source || "",
      utm_medium: data.utm_medium || "",
      utm_campaign: data.utm_campaign || "",
      utm_term: data.utm_term || "",
      utm_content: data.utm_content || "",

      page_url: data.page_url || "",
      created_at: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    };

    const response = await axios.post(process.env.GOOGLE_SCRIPT_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Google Sheet Error:", error.response?.data || error.message);

    throw error;
  }
}

module.exports = {
  saveLead,
};
