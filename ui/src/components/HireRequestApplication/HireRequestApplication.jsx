import { Card, Col, Container, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import { userService } from '../../services/user.service';
import Avatar from '../Avatar/Avatar';

function HireRequestApplication(props) {
  const { hireRequestApplication } = props;
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  useEffect(() => {
    userService.get(hireRequestApplication.user).then((u) => {
      setUser(u);
    });
  }, [hireRequestApplication.user, hireRequestApplication.id]);

  function getUrl(link, image) {
    if (!link) {
      return '';
    }
    /* only display if this is set */
    return (
      <Col>
        {/* if this doesn't start with an http, add one */}
        <a
          href={link.startsWith('http') ? link : `http://${link}`}
          target="_blank"
          rel="noreferrer"
        >
          {image}
        </a>
      </Col>
    );
  }

  return (
    <Row>
      <Col>
        <Card
          data-testid={`hireRequestApplication-${hireRequestApplication.id}`}
        >
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
                    <Col md={5}>
                      <h4>{hireRequestApplication.user_name}</h4>
                    </Col>
                    <Col md={6}>
                      <h4>{hireRequestApplication.company_name}</h4>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    {getUrl(
                      hireRequestApplication.website,
                      <Globe className="icon" />
                    )}
                    {getUrl(
                      hireRequestApplication.insta,
                      <Instagram className="icon" />
                    )}
                    {getUrl(
                      hireRequestApplication.fb,
                      <Facebook className="icon" />
                    )}
                  </Row>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>{hireRequestApplication.experience}</Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default HireRequestApplication;
