import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import './RequestToHire.css';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';
import { userService } from '../../services/user.service';

function RequestToHire(props) {
  const { hireRequest } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  useEffect(() => {
    userService.get(hireRequest.user).then((user) => {
      setUser(user);
    });
  }, [hireRequest.user]);

  return (
    <Row>
      <Col>
        <Card>
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
                    <Col md={3}>
                      <Button>Submit For Job</Button>
                    </Col>
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
