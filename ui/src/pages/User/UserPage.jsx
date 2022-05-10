import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import { userService } from '../../services/user.service';
import { companyService } from '../../services/company.service';
import NotFound from '../NotFound/NotFound';
import './UserPage.css';
import Avatar from '../../components/Avatar/Avatar';

// import RequestToHire from '../../components/RequestToHire/RequestToHire';

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
      (user) => {
        setUser(user);
        companyService.get(user.id).then((company) => {
          setCompany(company);
          let { portfolio, equipment, skills } = company;
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
        setUserError(error);
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
          <Col>
            <p>{company.experience}</p>
            {portfolioItems.map((portfolioItem) => (
              <a key={portfolioItem.id} href={portfolioItem.link}>
                {portfolioItem.description}
              </a>
            ))}
          </Col>
        </Row>
      </Col>
      <Col>
        <Row>
          <Col>
            <h2>{company.name}</h2>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <a href={company.website} target="_blank" rel="noreferrer">
              <Globe className="icon" />
            </a>
          </Col>
          <Col>
            <a href={company.insta} target="_blank" rel="noreferrer">
              <Instagram className="icon" />
            </a>
          </Col>
          <Col>
            <a href={company.fb} target="_blank" rel="noreferrer">
              <Facebook className="icon" />
            </a>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h4>Equipment</h4>
            {equipmentItems.map((option) => (
              <div key={option.value}>{option.name}</div>
            ))}
          </Col>
          <Col>
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
