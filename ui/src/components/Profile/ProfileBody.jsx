import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import IconLink from '../IconLink/IconLink';
import PortfolioLink from '../PortfolioLink/PortfolioLink';
import './Profile.css';

function ProfileBody(props) {
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
      <Row id={`job-application-${company.id}-links`} className="mb-3">
        <IconLink link={company.website} icon={<Globe className="icon" />} />
        <IconLink link={company.insta} icon={<Instagram className="icon" />} />
        <IconLink link={company.fb} icon={<Facebook className="icon" />} />
      </Row>
      <Row className="mb-3">
        <Col
          id={`job-application-${company.id}-experience`}
          className="text-justify"
        >
          {company.experience}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col
          id={`job-application-${company.id}-comment`}
          className="text-justify"
        >
          {company.comment}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col id={`job-application-${company.id}-equipment`} md={8}>
          <h2 className="h4">Equipment</h2>
          {equipmentItems.map((option) => (
            <div key={option.value}>
              <h3 className="h6">{option.name}</h3>
              {option.what.split('\n').map((what) => (
                <div>{what}</div>
              ))}
            </div>
          ))}
        </Col>
        <Col id={`job-application-${company.id}-skills`} md={4}>
          <h2 className="h4">Skills</h2>
          {skillItems.map((option) => (
            <div key={option.value}>{option.name}</div>
          ))}
        </Col>
      </Row>
      <Row id={`job-application-${company.id}-portfolio`}>
        <h2 className="h4">Portfolio</h2>
        <Col>
          {portfolioItems.map((portfolioItem) => (
            <PortfolioLink key={portfolioItem.id} portfolio={portfolioItem} />
          ))}
        </Col>
      </Row>
    </>
  );
}

export default ProfileBody;
