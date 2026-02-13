import axios from "axios";
import https from "https";

export default async function vehicleAPI(registrationNumber) {
  const url = "https://api.bureau.id/v2/services/rc-authentication";
  const options = {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization:
        "Basic OWM4ZTFjNzYtNDViOS00ZDU2LWJkNDAtNzhmMmNlZGVhYmQ5OmEzMDE0MzNkLTYzODMtNDY5ZS1iN2I3LTUxNWM1MzcxNzgzNA==",
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  try {
    const response = await axios.post(
      url,
      { docNumber: registrationNumber.rcNumber },
      options
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
