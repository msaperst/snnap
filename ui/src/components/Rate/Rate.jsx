import React, { useEffect, useState } from 'react';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import { HandThumbsDown, HandThumbsUp } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';

function Rate(props) {
  const { id, userId, jobId } = props;
  const [user, setUser] = useState({});
  const [job, setJob] = useState({});
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);

  useEffect(() => {
    userService.get(userId).then((user) => {
      setUser(user);
    });
    jobService.getJob(jobId).then((job) => {
      setJob(job);
    });
  }, [userId, jobId]);

  const handleSubmit = (rating) => {
    userService.rate(id, rating).then(
      () => {
        setUpdate('Thank you for submitting your rating.');
        setTimeout(() => {
          setUpdate(null);
          setStatus(null);
          setShow(false);
        }, 2000);
      },
      (error) => {
        setStatus(error.toString());
      }
    );
  };

  return (
    <Modal
      size="sm"
      show={show}
      onHide={() => setShow(false)}
      data-testid="rateModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Please Rate Your Experience</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Row className="mb-3">
          <Col>
            We hope working with{' '}
            <Link to={`/profile/${user.username}`}>
              {user.first_name} {user.last_name}
            </Link>{' '}
            on <Link to={`/jobs#${job.id}`}>the {job.type}</Link> was a good
            experience. Please let us know if you would work with them again.
          </Col>
        </Row>
        <Row className="mb-3">
          <Col className="text-center">
            <HandThumbsUp
              style={{ cursor: 'pointer' }}
              onClick={() => handleSubmit(true)}
              size={24}
            />
          </Col>
          <Col className="text-center">
            <HandThumbsDown
              style={{ cursor: 'pointer' }}
              onClick={() => handleSubmit(false)}
              size={24}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            {status && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setStatus(null)}
              >
                {status}
              </Alert>
            )}
            {update && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setUpdate(null)}
              >
                {update}
              </Alert>
            )}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default Rate;
