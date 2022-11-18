import React from 'react';
import { Col } from 'react-bootstrap';
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
      <a
        href={link.startsWith('http') ? link : `http://${link}`}
        target="_blank"
        rel="noreferrer"
      >
        {icon}
      </a>
    </Col>
  );
}

export default IconLink;
