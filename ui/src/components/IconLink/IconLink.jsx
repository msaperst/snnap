import React from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './IconLink.css';

function IconLink(props) {
  const { link, icon } = props;

  if (!link) {
    return '';
  }
  /* only display if this is set */
  return (
    <Col className="text-center">
      {/* if this doesn't start with an http, add one */}
      <Link
        to={link.startsWith('http') ? link : `http://${link}`}
        target="_blank"
        rel="noreferrer"
      >
        {icon}
      </Link>
    </Col>
  );
}

export default IconLink;
