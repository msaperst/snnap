import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { HandThumbsDown, HandThumbsUp } from 'react-bootstrap-icons';
import Avatar from '../Avatar/Avatar';
import './Profile.css';

function ProfileHeader(props) {
  const { user, company, onClick, selected } = props;
  const navigate = useNavigate();
  const [rating, setRating] = useState('');

  useEffect(() => {
    if (user.rating !== undefined && user.rating !== null) {
      setRating(
        user.rating ? (
          <HandThumbsUp title="Thumbs Up" />
        ) : (
          <HandThumbsDown title="Thumbs Down" />
        )
      );
    }
  }, [user.rating]);

  let radioButton = '';
  let avatarNav = null;
  if (onClick) {
    radioButton = (
      <Col xs={1} className="text-center">
        <Form.Check
          id={`select-job-application-${company.id}`}
          type="radio"
          disabled={selected}
          aria-label={`job-application-${company.id}`}
          name={`job-applications-${company.job_id}`}
          onClick={() => onClick(company.id)}
          defaultChecked={selected === company.id}
        />
      </Col>
    );
    avatarNav = () => navigate(`/profile/${user.username}`);
  }

  return (
    <Row>
      {radioButton}
      <Col md={2} xs={4}>
        <Avatar
          avatar={user.avatar}
          firstname={user.first_name}
          lastname={user.last_name}
          onClick={avatarNav}
        />
        <span className="rating">{rating}</span>
      </Col>
      <Col>
        <Row>
          <Col>
            <h2 id={`job-application-${company.id}-name`}>
              {company.user_name || `${user.first_name} ${user.last_name}`}
            </h2>
          </Col>
        </Row>
        <Row>
          <Col id={`job-application-${company.id}-company`}>
            <h3>{company.company_name || company.name}</h3>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ProfileHeader;
