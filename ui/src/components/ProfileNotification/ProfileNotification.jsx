import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { companyService } from '../../services/company.service';

function ProfileNotification() {
  const [show, setShow] = useState(false);
  const isMountedVal = useRef(true);

  useEffect(() => {
    isMountedVal.current = true;
    companyService.get().then((company) => {
      if (isMountedVal.current && company && !company.name) {
        setShow(true);
      }
    });
    return () => {
      isMountedVal.current = false;
    };
  }, []);

  const hide = useCallback(() => setShow(false), []);

  return (
    <Modal
      size="md"
      show={show}
      onHide={hide}
      data-testid="setUpProfileNotificationModal"
      aria-label="Profile Setup Notification"
    >
      <Modal.Header closeButton>
        <Modal.Title>Set Up Your Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Row className="mb-3">
          <Col>
            To get the most out of Snnap, you should add company information to
            your profile. This will make it easier for others to find you, and
            for you to create and submit to job postings.
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Link
              to="/settings"
              className="btn btn-primary"
              role="button"
              state={{ page: 'company' }}
              onClick={hide}
            >
              Update Settings
            </Link>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ProfileNotification;
