import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PortfolioLink(props) {
  const { portfolio } = props;

  if (!portfolio) {
    return '';
  }
  const { id, link, description } = portfolio;
  if (!link || !description) {
    return '';
  }

  /* only display if this is set */
  return (
    <Row key={id} className="mb-1">
      <Col>
        {/* if this doesn't start with an http, add one */}
        <Link
          to={link.startsWith('http') ? link : `http://${link}`}
          target="_blank"
          rel="noreferrer"
        >
          {description}
        </Link>
      </Col>
    </Row>
  );
}

export default PortfolioLink;
