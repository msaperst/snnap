import { Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { companyService } from '../../../services/company.service';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import Gallery from './Gallery/Gallery';
import Submit from '../../Submit/Submit';

function Portfolio(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const { company } = props;
  const [experience, setExperience] = useState('');
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    if (company) {
      setExperience(company.experience);
      setPortfolioItems(company.portfolio);
    }
  }, [company]);

  if (company === undefined) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      companyService.updatePortfolio(experience, portfolioItems).then(
        () => {
          setIsSubmitting(false);
          setStatus(null);
          setUpdate('Portfolio Updated');
          setTimeout(() => {
            setUpdate(null);
            setValidated(false);
          }, 5000);
        },
        (error) => {
          setIsSubmitting(false);
          setStatus(error.toString());
        }
      );
    }
  };

  const updateExperience = (key, value) => {
    setExperience(value);
  };

  const updatePortfolioItems = (items) => {
    setPortfolioItems(items);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Portfolio</h3>
      <Row className="mb-3">
        <SnnapFormInput
          name="Experience"
          type="textarea"
          value={experience}
          onChange={updateExperience}
          notRequired
        />
      </Row>
      <Gallery company={company} getPortfolioItems={updatePortfolioItems} />
      <Submit
        buttonText="Save Portfolio"
        isSubmitting={isSubmitting}
        error={status}
        updateError={setStatus}
        success={update}
        updateSuccess={setUpdate}
      />
    </Form>
  );
}

export default Portfolio;
