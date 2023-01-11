import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import UserVisual from '../UserVisual/UserVisual';
import './Profile.css';

function ProfileHeader(props) {
  const { user, company, onClick, selected } = props;
  const navigate = useNavigate();

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
        <UserVisual user={user} avatarNav={avatarNav} />
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
