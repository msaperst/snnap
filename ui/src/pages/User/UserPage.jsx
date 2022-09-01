import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import { userService } from '../../services/user.service';
import { companyService } from '../../services/company.service';
import NotFound from '../NotFound/NotFound';
import './UserPage.css';
import Avatar from '../../components/Avatar/Avatar';
import IconLink from '../../components/IconLink/IconLink';

function UserPage() {
  const { username } = useParams();

  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [skillItems, setSkillItems] = useState([]);
  const [userError, setUserError] = useState(null);

  useEffect(() => {
    userService.get(username).then(
      (u) => {
        setUser(u);
        companyService.get(u.id).then((comp) => {
          setCompany(comp);
          let { portfolio, equipment, skills } = comp;
          if (!portfolio) {
            portfolio = [];
          }
          setPortfolioItems(portfolio);
          if (!equipment) {
            equipment = [];
          }
          setEquipmentItems(equipment);
          if (!skills) {
            skills = [];
          }
          setSkillItems(skills);
        });
      },
      (error) => {
        setUserError(error.toString());
      }
    );
  }, [username]);

  if (userError) {
    return <NotFound />;
  }
  return (
    <Row>
      <Col>
        <Row>
          <Col md={2}>
            <Avatar
              avatar={user.avatar}
              firstname={user.first_name}
              lastname={user.last_name}
            />
          </Col>
          <Col>
            <h2>
              {user.first_name} {user.last_name}
            </h2>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>{company.experience}</Col>
        </Row>
        <Row className="mb-3">
          {portfolioItems.map((portfolioItem) => (
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
          ))}
        </Row>
      </Col>
      <Col>
        <Row>
          <Col>
            <h2>{company.name}</h2>
          </Col>
        </Row>
        <Row className="mb-3">
          <IconLink link={company.website} icon={<Globe className="icon" />} />
          <IconLink
            link={company.insta}
            icon={<Instagram className="icon" />}
          />
          <IconLink link={company.fb} icon={<Facebook className="icon" />} />
        </Row>
        <Row className="mb-3">
          <Col md={8}>
            <h4>Equipment</h4>
            {equipmentItems.map((option) => (
              <div key={option.value}>
                <b>{option.name}</b>: {option.what}
              </div>
            ))}
          </Col>
          <Col md={4}>
            <h4>Skills</h4>
            {skillItems.map((option) => (
              <div key={option.value}>{option.name}</div>
            ))}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default UserPage;
