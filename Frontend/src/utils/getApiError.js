const getFirstValidationError = (errors) => {
  if (!Array.isArray(errors) || errors.length === 0) return null;
  return errors[0]?.message || null;
};

export const getApiError = (error, fallback = "Something went wrong. Please try again.") => {
  const response = error?.response;

  if (!response) return fallback;

  const validationMessage = getFirstValidationError(response.data?.errors);
  if (validationMessage) return validationMessage;

  if (response.status === 401) return "Your session has expired. Please sign in again.";
  if (response.status === 403) return "You don't have permission to perform this action.";
  if (response.status === 404) return "The requested resource was not found.";
  if (response.status >= 500) return "The server could not complete the request. Try again.";

  return response.data?.message || fallback;
};
