import { Button, Card, Col, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import './Job.css';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChatDotsFill,
  HandThumbsDown,
  HandThumbsUp,
} from 'react-bootstrap-icons';
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
  const [button, setButton] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');

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
          <ChatDotsFill title={`Chat with ${user.username}`} color="#42a5f5" />
        </Link>
      );
    }
  }, [currentUser.username, user]);

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
      setButton(<CompareJobApplications job={job} />);
    } else if (applications.some((e) => e.user_id === currentUser.id)) {
      setButton(
        <Button job={job.id} disabled className="btn-block">
          Already Applied
        </Button>
      );
    } else {
      setButton(
        <ApplyToJob
          job={job}
          user={currentUser}
          equipment={equipment}
          skills={skills}
          applied={() => setApplied(true)}
        />
      );
    }
  }, [applications, currentUser, equipment, job, skills, applied]);

  return (
    <Card className="job" data-testid={`job-${job.id}`}>
      <Card.Body>
        <Row>
          <Col md={{ span: 2, offset: 0 }} xs={{ span: 6, offset: 3 }}>
            <div className="square">
              <Avatar
                avatar={user.avatar}
                firstname={user.first_name}
                lastname={user.last_name}
                onClick={() => navigate(`/profile/${user.username}`)}
              />
              <span className="rating">{rating}</span>
              <span className="message">{message}</span>
            </div>
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
