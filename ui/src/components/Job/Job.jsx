import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import './Job.css';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import Avatar from '../Avatar/Avatar';
import ApplyToJob from '../ApplyToJob/ApplyToJob';
import CompareJobApplications from '../CompareJobApplications/CompareJobApplications';

function Job(props) {
  const { job, equipment, skills, currentUser } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    userService.get(job.user).then((u) => {
      setUser(u);
    });
    jobService.getJobApplications(job.id).then((apps) => {
      setApplications(apps);
    });
  }, [job.user, job.id]);

  // determine which button we want (if mine, show applications; if applied for, disabled; else, apply for)
  let button;
  if (job.user === currentUser.id) {
    button = <CompareJobApplications job={job} />;
  } else if (applications.some((e) => e.user_id === currentUser.id)) {
    button = (
      <Button job={job.id} disabled>
        Already Applied
      </Button>
    );
  } else {
    button = (
      <ApplyToJob
        job={job}
        user={currentUser}
        equipment={equipment}
        skills={skills}
      />
    );
  }
  return (
    <Row>
      <Col>
        <Card data-testid={`job-${job.id}`}>
          <Card.Body>
            <Container>
              <Row>
                <Col md={1}>
                  <Avatar
                    avatar={user.avatar}
                    firstname={user.first_name}
                    lastname={user.last_name}
                    onClick={() => navigate(`/profile/${user.username}`)}
                  />
                </Col>
                <Col md={11}>
                  <Row>
                    <Col md={3}>
                      <h4>{job.type}</h4>
                    </Col>
                    <Col md={3}>
                      {new Intl.DateTimeFormat('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                      }).format(new Date(job.date_time))}
                    </Col>
                    <Col md={3}>
                      {job.duration}
                      {job.durationMax ? ` to ${job.durationMax}` : ''} hours
                    </Col>
                    <Col md={3}>{button}</Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      {job.loc.replace(', United States of America', '')}
                    </Col>
                    <Col md={3}>${job.pay} per hour</Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col className="details">{job.details}</Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Job;
