import { Button, Card, Col, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import './Job.css';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import Avatar from '../Avatar/Avatar';
import ApplyToJob from '../ApplyToJob/ApplyToJob';
import CompareJobApplications from '../CompareJobApplications/CompareJobApplications';
import { companyService } from '../../services/company.service';

function Job(props) {
  const { job, equipment, skills, currentUser } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});
  const [applied, setApplied] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    userService.get(job.user).then((u) => {
      setUser(u);
      companyService.get(u.id).then((comp) => {
        setCompany(comp);
      });
    });
    jobService.getJobApplications(job.id).then((apps) => {
      setApplications(apps);
    });
  }, [job.user, job.id, applied]);

  // determine which button we want (if mine, show applications; if applied for, disabled; else, apply for)
  let button;
  if (job.user === currentUser.id) {
    button = <CompareJobApplications job={job} />;
  } else if (applications.some((e) => e.user_id === currentUser.id)) {
    button = (
      <Button job={job.id} disabled className="btn-block">
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
        applied={() => setApplied(true)}
      />
    );
  }
  return (
    <Card data-testid={`job-${job.id}`}>
      <Card.Body>
        <Row>
          <Col md={2}>
            <Avatar
              avatar={user.avatar}
              firstname={user.first_name}
              lastname={user.last_name}
              onClick={() => navigate(`/profile/${user.username}`)}
            />
          </Col>
          <Col>
            <Row>
              <Col md={4} xs={6}>
                <Card.Title>{`${user.first_name} ${user.last_name}`}</Card.Title>
                <Card.Subtitle>{company.name}</Card.Subtitle>
              </Col>
              <Col md={4} xs={6}>
                <Card.Title>{job.type}</Card.Title>
                <Card.Subtitle>TBD - Coming with LA Fixes</Card.Subtitle>
              </Col>
              <Col md={4}>
                <Card.Text>
                  {job.loc.replace(', United States of America', '')}
                </Card.Text>
                <Card.Text className="font-italic">
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
                <Card.Text>{job.details}</Card.Text>
              </Col>
            </Row>
          </Col>
          <Col md={3}>{button}</Col>
        </Row>
      </Card.Body>
    </Card>
    //   </Card.Body>
    //     <Container>
    //       <Row>
    //         <Col md={11}>
    //           <Row>
    //             <Col md={3}>
    //               <h4>{job.type}</h4>
    //             </Col>
    //             <Col md={3}>
    //               {new Intl.DateTimeFormat('en-US', {
    //                 weekday: 'long',
    //                 year: 'numeric',
    //                 month: 'long',
    //                 day: '2-digit',
    //               }).format(new Date(job.date_time))}
    //             </Col>
    //             <Col md={3}>
    //               {job.duration}
    //               {job.durationMax ? ` to ${job.durationMax}` : ''} hours
    //             </Col>
    //             <Col md={3}>{button}</Col>
    //           </Row>
    //           <Row>
    //             <Col md={6}>
    //               {job.loc.replace(', United States of America', '')}
    //             </Col>
    //             <Col md={3}>${job.pay} per hour</Col>
    //           </Row>
    //         </Col>
    //       </Row>
    //       <Row className="mt-3">
    // X       <Col className="details">{job.details}</Col>
    //       </Row>
    //     </Container>
    //   </Card.Title>
    // </Card>
  );
}

export default Job;
