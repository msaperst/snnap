import ReactGA from 'react-ga4';

export const commonFormComponents = {
  setBasicSuccess,
  setRedrawSuccess,
  setSuccess,
  setPageView,
  setEvent,
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

function setSuccess(
  setStatus,
  setUpdate,
  message,
  setIsSubmitting,
  setShow,
  setValidated
) {
  setStatus(null);
  setUpdate(message);
  setTimeout(() => {
    setIsSubmitting(false);
    setShow(false);
    setUpdate(null);
    setValidated(false);
  }, 5000);
}

function setPageView(page) {
  const cookies = JSON.parse(localStorage.getItem('cookies'));
  if (!cookies || cookies.analytics) {
    let title = page.replace('/', ' ');
    title = title.substring(1);
    if (title === '') {
      title = 'Homepage';
    } else {
      const words = title.split(' ');
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
      title = words.join(' ');
    }
    ReactGA.send({ hitType: 'pageview', page, title });
  }
}

function setEvent(category, action) {
  const cookies = JSON.parse(localStorage.getItem('cookies'));
  if (!cookies || cookies.analytics) {
    ReactGA.event({ category, action });
  }
}
