import CustomError from "../customError.js";

export default async function serviceGoogleSheetController() {
  try {
    const response = await fetch(process.env.GOOGLE_SHEET_API_SERVICE);

    if (!response.ok) {
      if (response.status === 400) {
        throw new CustomError("Invalid request. Check query parameters.", 400);
      } else if (response.status === 401 || response.status === 403) {
        throw new CustomError(
          "Authentication failed. Verify API key or permissions.",
          response.status
        );
      } else if (response.status === 404) {
        throw new CustomError("Spreadsheet or sheet not found.", 404);
      } else if (response.status === 429) {
        throw new CustomError("Rate limit exceeded. Try again later.", 429);
      } else if (response.status === 408) {
        throw new CustomError(
          "Request timed out. Please try again later.",
          408
        );
      } else if (response.status === 405) {
        throw new CustomError(
          "Method Not Allowed. The method is not supported for the resource.",
          405
        );
      } else if (response.status === 410) {
        throw new CustomError(
          "Gone. The resource is no longer available.",
          410
        );
      } else if (response.status === 413) {
        throw new CustomError(
          "Payload Too Large. The request is too large for the server to process.",
          413
        );
      } else if (response.status === 415) {
        throw new CustomError(
          "Unsupported Media Type. The server does not support the media type of the request.",
          415
        );
      } else if (response.status >= 500 && response.status < 600) {
        throw new CustomError(
          "Server error. Please try again later.",
          response.status
        );
      } else {
        throw new CustomError(
          `Unexpected error. Status code: ${response.status}`,
          response.status
        );
      }
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      let data = await response.json();
      data = data.filter((val) => val["Battery No."] !== "");

      return { error: null, data };
    } else {
      throw new CustomError("Forbidden", 403);
    }
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        data: null,
        error: {
          status: error?.status || 401,
          message: error?.message || "Bad Request",
        },
      };
    }
  }
}
