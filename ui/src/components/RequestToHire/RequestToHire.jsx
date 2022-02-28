import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import React from 'react';
import './RequestToHire.css';

function RequestToHire(props) {
  const { hireRequest } = props;
  return (
    <Row>
      <Col>
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
            </Container>
          </Card.Body>
          <Card.Body>{hireRequest.details}</Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default RequestToHire;
