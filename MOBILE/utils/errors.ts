import axios from "axios";

// One place that turns a failed request into a message for the user, so the same
// failure reads the same on every screen.
//  - 4xx with a server message (wrong password, validation, duplicate...): show it.
//  - otherwise map the status; never show raw server errors for 5xx.
const STATUS_MESSAGES: Record<number, string> = {
  401: "Your session has expired. Please sign in again.",
  403: "You don't have access to this.",
  404: "This content is no longer available.",
  409: "This was already done.",
  429: "Too many attempts. Please wait a moment and try again.",
};

export const errorMessageFrom = (error: any): string => {
  if (!axios.isAxiosError(error) && !error?.response) {
    return error?.message || "Something went wrong. Please try again.";
  }
  const status: number | undefined = error?.response?.status;
  const serverMessage: string | undefined = error?.response?.data?.message;

  if (!status) {
    return error?.code === "ECONNABORTED"
      ? "The server took too long to respond. Please try again."
      : "Unable to connect. Check your internet connection.";
  }
  if (status >= 500) return "The server is having trouble right now. Please try again later.";
  if (serverMessage) return serverMessage;
  return STATUS_MESSAGES[status] ?? "The request could not be completed.";
};
