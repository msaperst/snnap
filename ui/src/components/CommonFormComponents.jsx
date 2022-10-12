export const commonFormComponents = {
  setBasicSuccess,
  setRedrawSuccess,
};

function setBasicSuccess(
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

function setRedrawSuccess(updateState, message) {
  updateState({
    status: null,
    update: message,
  });
  setTimeout(() => {
    updateState({
      isSubmitting: false,
      show: false,
      update: null,
      validated: false,
    });
    // no need to redraw or do anything as new jobs/updates are pulled via websockets
  }, 5000);
}
