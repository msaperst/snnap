import { Accordion, Col, Container, Row, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccordionHeader from 'react-bootstrap/AccordionHeader';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import Avatar from '../Avatar/Avatar';
import IconLink from '../IconLink/IconLink';
import './JobApplication.css';

function JobApplication(props) {
  const { jobApplication, radio, selected } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [fullJobApplication, setFullJobApplication] = useState(jobApplication);

  let name = (
    <Col md={6}>
      <h4>{fullJobApplication.user_name}</h4>
    </Col>
  );
  if (radio) {
    name = (
      <>
        <Col md={1}>
          <Form.Check
            type="radio"
            disabled={selected}
            aria-label={`jobApplication-${fullJobApplication.id}`}
            name={`jobApplications-${fullJobApplication.job_id}`}
            onClick={() => radio(fullJobApplication.id)}
            defaultChecked={selected === fullJobApplication.id}
          />
        </Col>
        <Col md={5}>
          <h4>{fullJobApplication.user_name}</h4>
        </Col>
      </>
    );
  }

  useEffect(() => {
    userService.get(jobApplication.user).then((u) => {
      setUser(u);
    });
    jobService.getJobApplication(jobApplication.id).then((hra) => {
      setFullJobApplication(hra);
    });
  }, [jobApplication.user, jobApplication.id]);

  return (
    <Accordion.Item
      eventKey={fullJobApplication.id}
      data-testid={`jobApplication-${fullJobApplication.id}`}
    >
      <AccordionHeader>
        <Container>
          <Row>
            {name}
            <Col md={6}>
              <h4>{fullJobApplication.company_name}</h4>
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
              link={fullJobApplication.website}
              icon={<Globe className="icon" />}
            />
            <IconLink
              link={fullJobApplication.insta}
              icon={<Instagram className="icon" />}
            />
            <IconLink
              link={fullJobApplication.fb}
              icon={<Facebook className="icon" />}
            />
          </Row>
          <Row className="mt-3">
            <Col>{fullJobApplication.experience}</Col>
          </Row>
          <Row className="mt-3">
            <Col md={8}>
              <h4>Equipment</h4>
              {fullJobApplication.equipment &&
              Array.isArray(fullJobApplication.equipment)
                ? fullJobApplication.equipment.map((option) => (
                    <div key={option.value}>
                      <b>{option.name}</b>: {option.what}
                    </div>
                  ))
                : ''}
            </Col>
            <Col md={4}>
              <h4>Skills</h4>
              {fullJobApplication.skills &&
              Array.isArray(fullJobApplication.skills)
                ? fullJobApplication.skills.map((option) => (
                    <div key={option.value}>{option.name}</div>
                  ))
                : ''}
            </Col>
          </Row>
          <Row className="mt-3">
            {fullJobApplication.portfolio &&
            Array.isArray(fullJobApplication.portfolio)
              ? fullJobApplication.portfolio.map((portfolioItem) => (
                  <Col md={2} key={portfolioItem.id}>
                    <a
                      href={
                        portfolioItem.link.startsWith('http')
                          ? portfolioItem.link
                          : `http://${portfolioItem.link}`
                      }
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

export default JobApplication;
