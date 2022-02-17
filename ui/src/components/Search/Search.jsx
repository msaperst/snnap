import { Button, Col, FormControl, InputGroup, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FaSearch } from 'react-icons/fa';
import React from 'react';
import searchGuy from './SearchGuy.png';
import './Search.css';
import { jobService } from '../../services/job.service';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobTypes: [],
    };
  }

  componentDidMount() {
    jobService.getJobTypes().then((jobTypes) => {
      this.setState({ jobTypes });
    });
  }

  render() {
    const { jobTypes } = this.state;
    const { filter, filteredOn } = this.props;
    return (
      <div id="search">
        <Row>
          <Col sm={12} md={6}>
            <h1 id="tagline">Photography help in a snap</h1>
            <h4 id="subTagline">The extra n is for easy</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum id urna ligula. In fringilla ullamcorper nulla. Nam
              iaculis quam lectus, ac lobortis tortor porta eget.
            </p>
          </Col>
          <Col md={6} className="d-md-block d-sm-none">
            <img src={searchGuy} alt="Search" className="searchGuy" />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Label htmlFor="searchForJobInput" visuallyHidden>
                Search For Job
              </Form.Label>
              <InputGroup className="mb-2">
                <FormControl
                  id="searchForJobInput"
                  placeholder="Search For Job"
                />
                <Button type="submit" id="searchForJobButton">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            {jobTypes.map((type) => (
              <Button
                className="btn-filter"
                key={type.id}
                variant={type.id === filteredOn ? 'secondary' : 'primary'}
                onClick={() => filter(type.id)}
              >
                {type.plural}
              </Button>
            ))}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Search;
