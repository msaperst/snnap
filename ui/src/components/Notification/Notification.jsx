import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { EnvelopeExclamationFill } from 'react-bootstrap-icons';
import { userService } from '../../services/user.service';
import './Notification.css';
import { jobService } from '../../services/job.service';

function Notification(props) {
  const { notification } = props;
  const [isRead, setIsRead] = useState(notification.reviewed);
  const [message, setMessage] = useState('');

  useEffect(() => {
    jobService.getHireRequest(notification.hire_request).then((hireRequest) => {
      jobService
        .getHireRequestApplication(notification.hire_request_application)
        .then((hireRequestApplication) => {
          if (notification.what === 'selected') {
            userService.get(hireRequest.user).then((user) => {
              setMessage(
                <>
                  <a href={`/profile/${user.username}`}>
                    {user.first_name} {user.last_name}
                  </a>{' '}
                  selected your{' '}
                  <a
                    href={`/hire-request-applications#${notification.hire_request_application}`}
                  >
                    hire request application
                  </a>
                </>
              );
            });
          } else {
            userService.get(hireRequestApplication.user_id).then((user) => {
              setMessage(
                <>
                  <a href={`/profile/${user.username}`}>
                    {hireRequestApplication.user_name}
                  </a>{' '}
                  applied to your{' '}
                  <a href={`/hire-requests#${notification.hire_request}`}>
                    hire request
                  </a>
                </>
              );
            });
          }
        });
    });
  }, [notification]);

  const markRead = () => {
    userService.markNotificationRead(notification.id).then(() => {
      setIsRead(true);
    });
  };

  return (
    <Row>
      <Col>
        <Card data-testid={`notification-${notification.id}`}>
          <Card.Body>
            <Container>
              <Row>
                <Col md={11}>{message}</Col>
                <Col md={1}>
                  {isRead ? (
                    ''
                  ) : (
                    <EnvelopeExclamationFill
                      color="red"
                      style={{ cursor: 'pointer' }}
                      onClick={() => markRead()}
                    />
                  )}
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Notification;
