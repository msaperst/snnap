import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { companyService } from '../../../services/company.service';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import Gallery from './Gallery/Gallery';

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
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Button
            id="savePortfolioButton"
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            Save Portfolio
          </Button>
        </Form.Group>
        <Col>
          {status && (
            <Alert variant="danger" dismissible onClose={() => setStatus(null)}>
              {status}
            </Alert>
          )}
          {update && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setUpdate(null)}
            >
              {update}
            </Alert>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export default Portfolio;
