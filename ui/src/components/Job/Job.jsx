import { Button, Card, Col, Row } from 'react-bootstrap';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplyToJob from '../ApplyToJob/ApplyToJob';
import CompareJobApplications from '../CompareJobApplications/CompareJobApplications';
import UserVisual from '../UserVisual/UserVisual';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import { companyService } from '../../services/company.service';
import './Job.css';

function Job(props) {
  const { job, equipment, skills, currentUser, active } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});
  const [applied, setApplied] = useState(false);
  const [applications, setApplications] = useState([]);
  const [button, setButton] = useState('');

  const appliedTrue = useCallback(() => setApplied(true), []);
  const avatarNav = useCallback(
    () => navigate(`/profile/${user.username}`),
    [navigate, user.username]
  );

  useEffect(() => {
    let isMounted = true;
    userService.get(job.user).then((u) => {
      if (isMounted) {
        setUser(u);
        companyService.get(u.id).then((comp) => {
          if (isMounted) {
            setCompany(comp);
          }
        });
      }
    });
    jobService.getJobApplications(job.id).then((apps) => {
      if (isMounted) {
        setApplications(apps);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [job, applied]);

  useEffect(() => {
    // determine which button we want (if mine, show applications; if applied for, disabled; else, apply for)
    if (job.user === currentUser.id) {
      setButton(<CompareJobApplications job={job} show={active} />);
    } else if (applications.some((e) => e.user_id === currentUser.id)) {
      setButton(
        <Button job={job.id} disabled className="btn-block">
          Already Applied
        </Button>
      );
    } else {
      setButton(
        <ApplyToJob
          show={active}
          job={job}
          user={currentUser}
          equipment={equipment}
          skills={skills}
          applied={appliedTrue}
        />
      );
    }
  }, [
    applications,
    currentUser,
    equipment,
    job,
    skills,
    applied,
    appliedTrue,
    active,
  ]);

  return (
    <Card
      className={`job ${active ? 'highlight' : ''}`}
      data-testid={`job-${job.id}`}
    >
      <Card.Body>
        <Row>
          <Col md={{ span: 2, offset: 0 }} xs={{ span: 6, offset: 3 }}>
            <UserVisual user={user} avatarNav={avatarNav} />
          </Col>
          <Col md={7}>
            <Row>
              <Col md={4} xs={6}>
                <Card.Title
                  id={`job-${job.id}-name`}
                >{`${user.first_name} ${user.last_name}`}</Card.Title>
                <Card.Subtitle id={`job-${job.id}-company`}>
                  {company.name}
                </Card.Subtitle>
              </Col>
              <Col md={4} xs={6}>
                <Card.Title id={`job-${job.id}-type`}>{job.type}</Card.Title>
                <Card.Subtitle id={`job-${job.id}-subtype`}>
                  {job.subtype}
                </Card.Subtitle>
              </Col>
              <Col md={4}>
                <Card.Text id={`job-${job.id}-location`}>
                  {job.loc.replace(', United States of America', '')}
                </Card.Text>
                <Card.Text
                  className="font-italic"
                  id={`job-${job.id}-date-time`}
                >
                  {new Intl.DateTimeFormat('en-US', {
                    // weekday: 'long',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).format(new Date(job.date_time))}{' '}
                  for {job.duration}
                  {job.durationMax ? ` to ${job.durationMax}` : ''} hours
                </Card.Text>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Card.Text className="details" id={`job-${job.id}-details`}>
                  {job.details}
                </Card.Text>
              </Col>
            </Row>
          </Col>
          <Col md={3}>{button}</Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default Job;
