const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { saveLead } = require("./services/googleSheet");
const { createLead } = require("./services/salesforce");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Candeur Backend Running",
  });
});

/**
 * Lead API
 */
app.post("/lead", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      budget,
      message,
      project,
      source,
      whatsapp,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      page_url,
    } = req.body;

    // Required Fields
    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone and Email are required.",
      });
    }

    const leadData = {
      name,
      phone,
      email,
      budget,
      message,
      project,
      source,
      whatsapp,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      page_url,
    };

    // ==========================
    // Google Sheet
    // ==========================

    let googleResponse = null;

    try {
      googleResponse = await saveLead(leadData);

      console.log("✅ Google Sheet Success");
    } catch (err) {
      console.error("❌ Google Sheet Failed");

      console.error(err.message);
    }

    // ==========================
    // Salesforce
    // ==========================
    let salesforceResponse = null;

    try {
      salesforceResponse = await createLead(leadData);

      console.log("✅ Salesforce Success");
    } catch (err) {
      console.error("❌ Salesforce Failed");

      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log(err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Lead Submitted Successfully",
      google: googleResponse,
      salesforce: salesforceResponse,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Internal Server Error",

      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on http://localhost:${PORT}`);
});
