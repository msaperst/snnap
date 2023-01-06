import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function GDPR(props) {
  const { showGDPR, setShowGDPR } = props;
  const [customize, setCustomize] = useState(false);

  let cookies = JSON.parse(localStorage.getItem('cookies'));

  useEffect(() => {
    if (!cookies) {
      setShowGDPR(true);
    }
  }, [cookies, setShowGDPR]);

  const saveGdprSettings = () => {
    if (!cookies) {
      cookies = {};
    }
    cookies.necessary = true;
    if (customize) {
      // select only the ones set
      cookies.preferences = document.querySelector(
        '#sitePreferencesCookies'
      ).checked;
      cookies.analytics = document.querySelector('#analyticsCookies').checked;
    } else {
      cookies.preferences = true;
      cookies.analytics = true;
    }
    localStorage.setItem('cookies', JSON.stringify(cookies));
    setShowGDPR(false);
    setCustomize(false);
  };

  const customizeGdprSettings = () => {
    setCustomize(
      <>
        <p>Select which cookies you want to accept:</p>
        <Form.Check id="necessaryCookies" checked disabled label="Necessary" />
        <Form.Check
          id="sitePreferencesCookies"
          defaultChecked={cookies && cookies.preferences}
          label="Site Preferences"
        />
        <Form.Check
          id="analyticsCookies"
          defaultChecked={cookies && cookies.analytics}
          label="Analytics"
        />
      </>
    );
  };

  return (
    <Modal
      show={showGDPR}
      onHide={() => setShowGDPR(false)}
      data-testid="gdpr"
      aria-label="Cookies & Privacy Policy"
    >
      <Modal.Header closeButton>
        <Modal.Title>Cookies & Privacy Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This site uses cookies in order to provide you with the best
          experience possible, provide social media features, analyze our
          traffic, and personalize jobs shown.
        </p>
        <p>
          Please click &apos;Accept&apos; to accept this use of your data.
          Alternatively, you may click &apos;Customize&apos; to accept (or
          reject) specific categories of data processing.
        </p>
        <p>
          For more information on how we process your personal data - or to
          update your preferences at any time - please visit our{' '}
          <Link to="/privacy-policy">Privacy Policy</Link>
        </p>
        {customize}
      </Modal.Body>
      <Modal.Footer>
        <Button
          id="customizePolicy"
          variant="secondary"
          onClick={customizeGdprSettings}
          disabled={customize}
        >
          Customize
        </Button>
        <Button id="acceptPolicy" variant="primary" onClick={saveGdprSettings}>
          Accept
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GDPR;
