import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import PortfolioItem from './PortfolioItem/PortfolioItem';
import { companyService } from '../../../services/company.service';

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
      // adding a blank portfolio instance to allow for editing ability
      let { portfolio } = company;
      if (portfolio) {
        portfolio.push({});
      } else {
        portfolio = [];
      }
      setPortfolioItems(portfolio);
    }
  }, [company]);

  if (company === undefined) {
    return null;
  }

  const removeRequired = () => {
    const lastDescription = document.getElementById(
      `${portfolioItems.length - 1}:Description`
    );
    const lastLink = document.getElementById(
      `${portfolioItems.length - 1}:Link`
    );
    if (lastDescription.value === '' && lastLink.value === '') {
      lastDescription.removeAttribute('required');
      lastLink.removeAttribute('required');
    }
  };

  const addRequired = () => {
    document
      .getElementById(`${portfolioItems.length - 1}:Description`)
      .setAttribute('required', '');
    document
      .getElementById(`${portfolioItems.length - 1}:Link`)
      .setAttribute('required', '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeRequired();
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
            addRequired();
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

  const updatePortfolioItems = (key) => {
    addRequired();
    // pull the data that we need/want
    const parts = key.split(':');
    const index = parseInt(parts[0], 10);
    const description = document.getElementById(
      `${parts[0]}:Description`
    ).value;
    const link = document.getElementById(`${parts[0]}:Link`).value;
    const items = [...portfolioItems];
    items[index] = { description, link };
    setPortfolioItems(items);

    // if each row has some data, we should add another row
    let anyEmpty = true;
    items.forEach((item) => {
      if (!item.description || !item.link) {
        anyEmpty = false;
      }
    });
    if (anyEmpty) {
      items.push({});
      setPortfolioItems(items);
    }

    // if we just emptied a row, and it's not the last one, we should remove it
    let isEmpty = null;
    items.forEach((item, index) => {
      if (!item.description && !item.link && index < items.length - 1) {
        isEmpty = index;
      }
    });
    if (isEmpty != null) {
      items.splice(isEmpty, 1);
      setPortfolioItems(items);
    }
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
      {portfolioItems.map((portfolioItem, index) => (
        <PortfolioItem
          key={portfolioItem.id || index - 10}
          order={index}
          link={portfolioItem.link}
          description={portfolioItem.description}
          onChange={updatePortfolioItems}
        />
      ))}
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
