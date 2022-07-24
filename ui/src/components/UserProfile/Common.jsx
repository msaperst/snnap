export const common = {
  setSuccess,
};

function setSuccess(
  setIsSubmitting,
  setStatus,
  setUpdate,
  setValidated,
  message
) {
  setIsSubmitting(false);
  setStatus(null);
  setUpdate(message);
  setTimeout(() => {
    setUpdate(null);
    setValidated(false);
  }, 5000);
}
