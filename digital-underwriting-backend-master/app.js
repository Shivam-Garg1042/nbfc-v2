import express from "express";
import axios from "axios";
import https from "https";

export const app = express();
app.use(express.json());

app.post("/creditDetails", async (req, res) => {
  const url =
    "https://api.sandbox.bureau.id/v2/services/credit-report-generation";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization:
        "Basic NzZmYjczMzctOWJiYy00YTA4LWE2ZGEtNTQxZGNiYzBhY2UwOjk3OGJhYWE3LWY3YzctNGQ0Yy05ZTcyLTJlODI1NmJmZGQ1Yw==",
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  try {
    const response = await axios.post(url, req.body, options);
    res.json({ data: response.data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post("/rcDetails", async (req, res) => {
  const url = "https://api.sandbox.bureau.id/v2/services/rc-authentication";
  const options = {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization:
        "Basic NzZmYjczMzctOWJiYy00YTA4LWE2ZGEtNTQxZGNiYzBhY2UwOjk3OGJhYWE3LWY3YzctNGQ0Yy05ZTcyLTJlODI1NmJmZGQ1Yw==",
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  try {
    const response = await axios.post(
      url,
      { docNumber: "DL8CBA7537" },
      options
    );
    res.json({ data: response.data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post("/riskScore", async (req, res) => {
  const url = "https://api.sandbox.bureau.id/transactions";
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic NzZmYjczMzctOWJiYy00YTA4LWE2ZGEtNTQxZGNiYzBhY2UwOjk3OGJhYWE3LWY3YzctNGQ0Yy05ZTcyLTJlODI1NmJmZGQ1Yw==",
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  let data = {
    workflowId: "f3009b74-f67c-479c-b493-122be98ca20b",
    data: {
      countryCode: "IND",
      email: "gauravjoshi7060331206@gmail.com",
      name: "gaurav joshi",
      phoneNumber: "918287289204",
      derivedSignals: true,
      enhancedCoverage: true,
    },
  };

  const response1 = await axios
    .post(url, data, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  data = { transactionId: response1.data.transactionId, ...data };

  const response2 = await axios
    .post(url, data, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  res.json({ data: response2.data });
});
