import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import IconLink from '../IconLink/IconLink';
import PortfolioLink from '../PortfolioLink/PortfolioLink';
import './Profile.css';

function ProfileCard(props) {
  const { company } = props;

  const [portfolioItems, setPortfolioItems] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [skillItems, setSkillItems] = useState([]);

  useEffect(() => {
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
  }, [company]);

  return (
    <>
      <Row className="mb-3">
        <IconLink link={company.website} icon={<Globe className="icon" />} />
        <IconLink link={company.insta} icon={<Instagram className="icon" />} />
        <IconLink link={company.fb} icon={<Facebook className="icon" />} />
      </Row>
      <Row className="mb-3">
        <Col className="text-justify">{company.experience}</Col>
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
      <Row>
        <h4>Portfolio</h4>
        <Col>
          {portfolioItems.map((portfolioItem) => (
            <PortfolioLink key={portfolioItem.id} portfolio={portfolioItem} />
          ))}
        </Col>
      </Row>
    </>
  );
}

export default ProfileCard;
