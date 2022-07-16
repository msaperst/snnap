import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import './RequestToHire.css';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import { userService } from '../../services/user.service';
import ApplyToRequestToHire from '../ApplyToRequestToHire/ApplyToRequestToHire';
import { jobService } from '../../services/job.service';

function RequestToHire(props) {
  const { hireRequest, equipment, skills, currentUser } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    userService.get(hireRequest.user).then((user) => {
      setUser(user);
    });
    jobService.getHireRequestApplications(hireRequest.id).then((apps) => {
      setApplications(apps);
    });
  }, [hireRequest.user, hireRequest.id]);

  // determine which button we want (if mine, show applications; if applied for, disabled; else, apply for)
  let button;
  if (hireRequest.user === currentUser.id) {
    button = <Button hire-request={hireRequest.id}>Show Applications</Button>;
  } else if (applications.some((e) => e.user_id === currentUser.id)) {
    button = (
      <Button hire-request={hireRequest.id} disabled>
        Already Applied
      </Button>
    );
  } else {
    button = (
      <ApplyToRequestToHire
        hireRequest={hireRequest}
        user={currentUser}
        equipment={equipment}
        skills={skills}
      />
    );
  }
  return (
    <Row>
      <Col>
        <Card data-testid={`requestToHire-${hireRequest.id}`}>
          <Card.Body>
            <Container>
              <Row>
                <Col md={1}>
                  <Avatar
                    avatar={user.avatar}
                    firstname={user.first_name}
                    lastname={user.last_name}
                    onClick={() => navigate(`/profile/${user.username}`)}
                  />
                </Col>
                <Col md={11}>
                  <Row>
                    <Col md={3}>
                      <h4>{hireRequest.type}</h4>
                    </Col>
                    <Col md={3}>
                      {new Intl.DateTimeFormat('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      }).format(new Date(hireRequest.date_time))}
                    </Col>
                    <Col md={3}>
                      {hireRequest.duration}
                      {hireRequest.durationMax
                        ? ` to ${hireRequest.durationMax}`
                        : ''}{' '}
                      hours
                    </Col>
                    <Col md={3}>{button}</Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      {hireRequest.location.replace(
                        ', United States of America',
                        ''
                      )}
                    </Col>
                    <Col md={3}>${hireRequest.pay} per hour</Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>{hireRequest.details}</Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default RequestToHire;
