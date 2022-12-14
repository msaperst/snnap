import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import './Footer.css';

function Footer() {
  return (
    <Row className="footer">
      <Col className="text-start">
        Copyright © SNNAP {new Date().getFullYear()}
      </Col>
      <Col className="text-end">
        <Link to="/privacy-policy">Privacy Policy</Link> |{' '}
        <Link to="/terms-of-use">Terms of Use</Link>
      </Col>
    </Row>
  );
}

export default Footer;
