function handleRequestError(error, defaultMessage = "Something went wrong!") {
  return error.response?.data?.message || defaultMessage;
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export { handleRequestError, formatDate };
