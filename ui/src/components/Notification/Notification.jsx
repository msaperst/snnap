import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import { EnvelopeExclamationFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import './Notification.css';

function Notification(props) {
  const { notification } = props;
  const [isRead, setIsRead] = useState(notification.reviewed);
  const [message, setMessage] = useState('');

  useEffect(() => {
    jobService.getJob(notification.job).then((job) => {
      if (notification.job_application) {
        jobService
          .getJobApplication(notification.job_application)
          .then((jobApplication) => {
            if (notification.what === 'selected') {
              userService.get(job.user).then((user) => {
                setMessage(
                  <>
                    <Link to={`/profile/${user.username}`}>
                      {user.first_name} {user.last_name}
                    </Link>{' '}
                    selected your{' '}
                    <Link
                      to={`/job-applications#${notification.job_application}`}
                    >
                      job application
                    </Link>
                  </>
                );
              });
            } else {
              userService.get(jobApplication.user_id).then((user) => {
                setMessage(
                  <>
                    <Link to={`/profile/${user.username}`}>
                      {jobApplication.user_name}
                    </Link>{' '}
                    applied to your{' '}
                    <Link to={`/jobs#${notification.job}`}>job</Link>
                  </>
                );
              });
            }
          });
      } else {
        userService.get(job.user).then((user) => {
          setMessage(
            <>
              <Link to={`/profile/${user.username}`}>
                {user.first_name} {user.last_name}
              </Link>{' '}
              created a <Link to={`/#${notification.job}`}>job</Link> in your
              area
            </>
          );
        });
      }
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
                    <OverlayTrigger
                      overlay={<Tooltip>Mark message as read</Tooltip>}
                    >
                      <EnvelopeExclamationFill
                        color="red"
                        style={{ cursor: 'pointer' }}
                        onClick={() => markRead()}
                      />
                    </OverlayTrigger>
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
