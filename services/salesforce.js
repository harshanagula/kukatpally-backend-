const axios = require("axios");
require("dotenv").config();

/**
 * Generate Salesforce Access Token
 */
async function getAccessToken() {
  try {
    const params = new URLSearchParams();

    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.SF_CLIENT_ID);
    params.append("client_secret", process.env.SF_CLIENT_SECRET);

    const response = await axios.post(process.env.SF_TOKEN_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Salesforce Token Error:", error.response?.data || error.message);

    throw new Error("Unable to generate Salesforce access token.");
  }
}

/**
 * Create Salesforce Lead
 */
async function createLead(data) {
  try {
    const token = await getAccessToken();

    const payload = {
      FirstName: data.firstName || "",

      LastName: data.lastName || data.name,

      Phone: data.phone,

      Email: data.email,

      BudgetRange: data.budget || "",

      campaign: data.utm_campaign || "",

      medium: data.utm_medium || "",

      term: data.utm_term || "",

      subSource: data.utm_source || "",

      source: data.source || "Website",

      project: data.project || "Novo gardenia",

      channel: data.project || "In-House",

      firstEnquirySource: data.source || "Website",

      whatsAppNumber: data.whatsapp || data.phone,
    };

    const response = await axios.post(
      process.env.SF_LEAD_URL,

      payload,

      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Salesforce Lead Error:", error.response?.data || error.message);

    throw error;
  }
}

module.exports = {
  createLead,
};
