import { Accordion, Col, Container, Row, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import Avatar from '../Avatar/Avatar';
import IconLink from '../IconLink/IconLink';
import './HireRequestApplication.css';

function HireRequestApplication(props) {
  const { hireRequestApplication, radio, selected } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [fullHireRequestApplication, setFullHireRequestApplication] = useState(
    hireRequestApplication
  );

  let name = (
    <Col md={6}>
      <h4>{fullHireRequestApplication.user_name}</h4>
    </Col>
  );
  if (radio) {
    name = (
      <>
        <Col md={1}>
          <Form.Check
            type="radio"
            disabled={selected}
            aria-label={`hireRequestApplication-${fullHireRequestApplication.id}`}
            name={`hireRequestApplications-${fullHireRequestApplication.hire_request_id}`}
            onClick={() => radio(fullHireRequestApplication.id)}
            defaultChecked={selected === fullHireRequestApplication.id}
          />
        </Col>
        <Col md={5}>
          <h4>{fullHireRequestApplication.user_name}</h4>
        </Col>
      </>
    );
  }

  useEffect(() => {
    userService.get(hireRequestApplication.user).then((u) => {
      setUser(u);
    });
    jobService
      .getHireRequestApplication(hireRequestApplication.id)
      .then((hra) => {
        setFullHireRequestApplication(hra);
      });
  }, [hireRequestApplication.user, hireRequestApplication.id]);

  return (
    <Accordion.Item
      eventKey={fullHireRequestApplication.id}
      data-testid={`hireRequestApplication-${fullHireRequestApplication.id}`}
    >
      <AccordionHeader>
        <Container>
          <Row>
            {name}
            <Col md={6}>
              <h4>{fullHireRequestApplication.company_name}</h4>
            </Col>
          </Row>
        </Container>
      </AccordionHeader>
      <Accordion.Body>
        <Container>
          <Row className="mt-3">
            <Col md={2}>
              <Avatar
                avatar={user.avatar}
                firstname={user.firstName}
                lastname={user.lastName}
                onClick={() => navigate(`/profile/${user.username}`)}
              />
            </Col>
            <Col md={1} />
            <IconLink
              link={fullHireRequestApplication.website}
              icon={<Globe className="icon" />}
            />
            <IconLink
              link={fullHireRequestApplication.insta}
              icon={<Instagram className="icon" />}
            />
            <IconLink
              link={fullHireRequestApplication.fb}
              icon={<Facebook className="icon" />}
            />
          </Row>
          <Row className="mt-3">
            <Col>{fullHireRequestApplication.experience}</Col>
          </Row>
          <Row className="mt-3">
            <Col md={8}>
              <h4>Equipment</h4>
              {fullHireRequestApplication.equipment &&
              Array.isArray(fullHireRequestApplication.equipment)
                ? fullHireRequestApplication.equipment.map((option) => (
                    <div key={option.value}>
                      <b>{option.name}</b>: {option.what}
                    </div>
                  ))
                : ''}
            </Col>
            <Col md={4}>
              <h4>Skills</h4>
              {fullHireRequestApplication.skills &&
              Array.isArray(fullHireRequestApplication.skills)
                ? fullHireRequestApplication.skills.map((option) => (
                    <div key={option.value}>{option.name}</div>
                  ))
                : ''}
            </Col>
          </Row>
          <Row className="mt-3">
            {fullHireRequestApplication.portfolio &&
            Array.isArray(fullHireRequestApplication.portfolio)
              ? fullHireRequestApplication.portfolio.map((portfolioItem) => (
                  <Col md={2} key={portfolioItem.id}>
                    <a
                      href={portfolioItem.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {portfolioItem.description}
                    </a>
                  </Col>
                ))
              : ''}
          </Row>
        </Container>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default HireRequestApplication;
