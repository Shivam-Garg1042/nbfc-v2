import axios from "axios";

export default async function creditAPI(creditParams) {
  const url = "https://kyc-api.surepass.app/api/v1/credit-report-crif/fetch-report-pdf";
  
  const requestData = {
    first_name: creditParams.firstName,
    last_name: creditParams.lastName,
    mobile: creditParams.mobile,
    pan: creditParams.pan,
    consent: "Y",
    raw: false
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1Mzk2NjIyMCwianRpIjoiOGIxYmVkYmYtMTk5MC00MmQ0LWFkMzgtYjI3YTYxN2FmNzUyIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnJpdGVzaGt1bWFyQHN1cmVwYXNzLmlvIiwibmJmIjoxNzUzOTY2MjIwLCJleHAiOjIzODQ2ODYyMjAsImVtYWlsIjoicml0ZXNoa3VtYXJAc3VyZXBhc3MuaW8iLCJ0ZW5hbnRfaWQiOiJtYWluIiwidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbInVzZXIiXX19.z2TAiR4LGV1MGjVHQkg5JqGTAtvMkfUpKN_jBcD-MYg"
    },
    timeout: 30000 // 30 seconds timeout
  };

  try {
    console.log('Credit API Request:', requestData);
    const response = await axios.post(url, requestData, options);
    
    if (response.data && response.data.success) {
      return {
        statusCode: 200,
        data: {
          clientId: response.data.data.client_id,
          firstName: response.data.data.first_name,
          lastName: response.data.data.last_name,
          mobile: response.data.data.mobile,
          pan: response.data.data.pan,
          creditScore: response.data.data.credit_score,
          creditReportLink: response.data.data.credit_report_link,
          creditReport: response.data.data.credit_report
        }
      };
    } else {
      return {
        statusCode: 400,
        error: response.data?.message || 'Credit report generation failed'
      };
    }
  } catch (error) {
    console.error("Credit API Error:", error);
    
    if (error.response) {
      return {
        statusCode: error.response.status,
        error: error.response.data?.message || 'Credit API request failed'
      };
    } else if (error.code === 'ECONNABORTED') {
      return {
        statusCode: 504,
        error: 'Request timeout - Please try again'
      };
    } else {
      return {
        statusCode: 500,
        error: 'Internal server error'
      };
    }
  }
}
