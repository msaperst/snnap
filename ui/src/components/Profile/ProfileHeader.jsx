import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import Avatar from '../Avatar/Avatar';
import './Profile.css';

function ProfileHeader(props) {
  const { user, company, onClick, selected } = props;
  const navigate = useNavigate();

  let radioButton = '';
  let avatarNav = null;
  if (onClick) {
    radioButton = (
      <Col md={1} xs={3} className="text-center">
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
      <Col md={2} xs={6}>
        <Avatar
          avatar={user.avatar}
          firstname={user.first_name}
          lastname={user.last_name}
          onClick={avatarNav}
        />
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
