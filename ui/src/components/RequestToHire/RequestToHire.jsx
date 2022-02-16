import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import React from 'react';
import './RequestToHire.css';

function RequestToHire(props) {
  const { hireRequest } = props;
  const t = hireRequest.date_time.split(/[- :.T]/);
  const d = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]));

  return (
    <Card>
      <Card.Body>
        <Container>
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
              }).format(d)}
            </Col>
            <Col md={3}>
              {hireRequest.duration} {hireRequest.units}
            </Col>
            <Col md={3}>
              <Button>Submit For Job</Button>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              {hireRequest.location.replace(', United States of America', '')}
            </Col>
            <Col md={3}>
              {new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
              }).format(d)}
            </Col>
            <Col md={3}>${hireRequest.pay}</Col>
          </Row>
        </Container>
      </Card.Body>
      <Card.Body>{hireRequest.details}</Card.Body>
    </Card>
  );
}

export default RequestToHire;
