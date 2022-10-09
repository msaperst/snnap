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
    jobService.getJob(notification.job).then((job) => {
      jobService
        .getJobApplication(notification.job_application)
        .then((jobApplication) => {
          if (notification.what === 'selected') {
            userService.get(job.user).then((user) => {
              setMessage(
                <>
                  <a href={`/profile/${user.username}`}>
                    {user.first_name} {user.last_name}
                  </a>{' '}
                  selected your{' '}
                  <a href={`/job-applications#${notification.job_application}`}>
                    job application
                  </a>
                </>
              );
            });
          } else {
            userService.get(jobApplication.user_id).then((user) => {
              setMessage(
                <>
                  <a href={`/profile/${user.username}`}>
                    {jobApplication.user_name}
                  </a>{' '}
                  applied to your <a href={`/jobs#${notification.job}`}>job</a>
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
