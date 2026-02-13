import axios from "axios";
import https from "https";

export default async function riskAPI(input) {
  const url = "https://api.bureau.id/transactions";
  const options = {
    headers: {
      "Content-Type": "application/json",
      authorization:
        "Basic OWM4ZTFjNzYtNDViOS00ZDU2LWJkNDAtNzhmMmNlZGVhYmQ5OmEzMDE0MzNkLTYzODMtNDY5ZS1iN2I3LTUxNWM1MzcxNzgzNA==",
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  let apiInput1 = {
    workflowId: "a8229dca-9193-4b74-a5a5-684d5744c7ad",
    data: {
      countryCode: "IND",
      phoneNumber: "91" + input.phoneNumber,
      name: input.name,
      // derivedSignals: true,
      // enhancedCoverage: true,
    },
  };

  let response1;
  try {
    response1 = await axios.post(url, apiInput1, options);
  } catch (error) {
    return {
      error: true,
      message: "First API call failed",
      details: error.response?.data || error.message,
    };
  }

  if (response1.status !== 200) {
    return {
      error: true,
      message: "First API call returned non-200 status",
      statusCode: 400,
    };
  }

  // Second API call input with transactionId
  const apiInput2 = {
    transactionId: response1.data?.transactionId,
    ...apiInput1,
  };

  let response2;
  try {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    response2 = await axios.post(url, apiInput2, options);
  } catch (error) {
    return {
      error: true,
      message: "Second API call failed",
      details: error.response?.data || error.message,
    };
  }

  return response2.data;
}
