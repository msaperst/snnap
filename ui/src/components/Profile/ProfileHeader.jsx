import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { ChatDots, HandThumbsDown, HandThumbsUp } from 'react-bootstrap-icons';
import Avatar from '../Avatar/Avatar';
import './Profile.css';
import { authenticationService } from '../../services/authentication.service';

function ProfileHeader(props) {
  const { user, company, onClick, selected } = props;
  const navigate = useNavigate();
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');

  const currentUser = authenticationService.currentUserValue;

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
    if (user && user.username && user.username !== currentUser.username) {
      setMessage(
        <Link
          to="/chat"
          alt={`Chat with ${user.username}`}
          state={{ user: user.username }}
        >
          <ChatDots title="Chat" color="white" />
        </Link>
      );
    }
  }, [currentUser.username, user]);

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

  let companyName;
  if (company.company_name) {
    companyName = <h2 className="h3">{company.company_name}</h2>;
  } else if (company.name) {
    companyName = <h2 className="h3">{company.name}</h2>;
  } else {
    companyName = '';
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
        <span className="message">{message}</span>
      </Col>
      <Col>
        <Row>
          <Col>
            <h1 className="h2" id={`job-application-${company.id}-name`}>
              {company.user_name || `${user.first_name} ${user.last_name}`}
            </h1>
          </Col>
        </Row>
        <Row>
          <Col id={`job-application-${company.id}-company`}>{companyName}</Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ProfileHeader;
