import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import React, { useState } from 'react';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import { userService } from '../../../services/user.service';
import PortfolioItem from './PortfolioItem/PortfolioItem';

function Portfolio(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const { companyExperience, portfolio } = props;
  const [portfolioItems, setPortfolioItems] = useState(portfolio);
  const [experience, setExperience] = useState(companyExperience);

  if (companyExperience === undefined || portfolio === undefined) {
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
      userService.updatePortfolio(experience, portfolioItems).then(
        () => {
          setIsSubmitting(false);
          setUpdate('Portfolio Updated');
          setTimeout(() => {
            setUpdate(null);
            setValidated(false);
          }, 5000);
          addRequired();
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

  const updatePortfilioItems = (key) => {
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
    for (let i = 0; i < items.length; i++) {
      const description = document.getElementById(`${i}:Description`).value;
      const link = document.getElementById(`${i}:Link`).value;
      if (description === '' || link === '') {
        anyEmpty = false;
        break;
      }
    }
    if (anyEmpty) {
      items.push({});
      setPortfolioItems(items);
    }

    // if we just emptied a row, and it's not the last one, we should remove it
    // TODO - this does odd things, i think because of promises, so leaving out for now...
    // for (let i = 0; i < items.length; i++) {
    //   if (items[i].description === '' && items[i].link === '') {
    //     items.splice(index, 1);
    //     setPortfolioItems(items);
    //     break;
    //   }
    // }
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
        />
      </Row>
      {portfolioItems.map((portfolioItem, index) => (
        <PortfolioItem
          key={portfolioItem.id || index}
          order={index}
          link={portfolioItem.link}
          description={portfolioItem.description}
          onChange={updatePortfilioItems}
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
