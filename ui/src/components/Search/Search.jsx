import { Button, Col, FormControl, InputGroup, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FaSearch } from 'react-icons/fa';
import React from 'react';
import searchGuy from './SearchGuy.png';
import './Search.css';

function Search(props) {
  const { filter } = props;
  return (
    <div id="search">
      <Row>
        <Col sm={12} md={6}>
          <h1 id="tagline">
            Photography help in a <i>snap</i>
          </h1>
          <p>
            Snnap is a community for photophiles; connecting photographers,
            editors, assistants, and all involved in helping to capture moments.
            Come here to find jobs others are posting, or to create your own
            request for assistance.
          </p>
        </Col>
        <Col md={6} className="d-lg-block d-md-none d-none">
          <img src={searchGuy} alt="Search" className="searchGuy" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Label htmlFor="searchForJobInput" visuallyHidden>
              Search For Job
            </Form.Label>
            <InputGroup className="mb-2">
              <FormControl
                id="searchForJobInput"
                placeholder="Search For Job"
                onChange={filter}
              />
              <Button
                type="submit"
                aria-label="Submit Search For Job"
                id="searchForJobButton"
              >
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Search;
