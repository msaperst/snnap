import React, { useEffect, useState } from 'react';
import { Form, Row } from 'react-bootstrap';
import SnnapFormTextarea from '../../SnnapForms/SnnapFormTextarea';
import Gallery from './Gallery/Gallery';
import Submit from '../../Submit/Submit';
import { companyService } from '../../../services/company.service';
import { commonFormComponents } from '../../CommonFormComponents';

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
          commonFormComponents.setBasicSuccess(
            setIsSubmitting,
            setStatus,
            setUpdate,
            setValidated,
            'Portfolio Updated'
          );
        },
        (error) => {
          setIsSubmitting(false);
          setStatus(error.toString());
        }
      );
    }
  };

  const updateExperience = (_key, value) => {
    setExperience(value);
  };

  const updatePortfolioItems = (items) => {
    setPortfolioItems(items);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h2 className="h3">Portfolio</h2>
      <Row className="mb-3">
        <SnnapFormTextarea
          name="Experience"
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
