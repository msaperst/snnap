import React from 'react';

import { Col, Form, Row } from 'react-bootstrap';
import Search from '../../components/Search/Search';
import { authenticationService } from '../../services/authentication.service';
import { userService } from '../../services/user.service';
import { jobService } from '../../services/job.service';
import RequestToHire from '../../components/RequestToHire/RequestToHire';
import './HomePage.css';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      allHireRequests: [],
      filteredHireRequests: [],
      filteredOn: null,
      showHelpers: true,
      showEmployers: true,
      equipment: [],
      skills: [],
    };

    this.filterType = this.filterType.bind(this);
    this.filterWhat = this.filterWhat.bind(this);
    this.sortBy = this.sortBy.bind(this);
  }

  componentDidMount() {
    userService.get().then((user) => {
      const { currentUser } = this.state;
      currentUser.lastLogin = user.lastLogin;
      this.setState({ currentUser });
    });
    jobService.getEquipment().then((equipment) => {
      this.setState({ equipment });
    });
    jobService.getSkills().then((skills) => {
      this.setState({ skills });
    });
    jobService.getHireRequests().then((hireRequests) => {
      hireRequests.sort(
        (a, b) => new Date(a.date_time) - new Date(b.date_time)
      );
      this.setState({
        allHireRequests: hireRequests,
        filteredHireRequests: hireRequests,
      });
    });
  }

  filterWhat(event, currentValue) {
    const id = event.target.getAttribute('id');
    if (id === 'showHelpers') {
      this.setState({ showHelpers: !currentValue });
      // TODO - filter once we have some of these in the system
    } else if (id === 'showEmployers') {
      this.setState({ showEmployers: !currentValue });
      if (currentValue) {
        this.setState({ filteredHireRequests: [] });
      } else {
        const { allHireRequests } = this.state;
        this.setState({ filteredHireRequests: allHireRequests });
      }
    }
  }

  filterType(type) {
    const { allHireRequests, filteredOn } = this.state;
    let filteredHireRequests = [];
    if (filteredOn === type) {
      // undo our filtering
      this.setState({ filteredOn: null });
      filteredHireRequests = allHireRequests;
    } else {
      // do our filtering
      this.setState({ filteredOn: type });
      allHireRequests.forEach((hireRequest) => {
        if (hireRequest.typeId === type) {
          filteredHireRequests.push(hireRequest);
        }
      });
    }
    this.setState({ filteredHireRequests });
  }

  sortBy(sort) {
    const { filteredHireRequests } = this.state;
    if (sort === '0') {
      filteredHireRequests.sort(
        (a, b) => new Date(a.date_time) - new Date(b.date_time)
      );
    } else if (sort === '1') {
      filteredHireRequests.sort(
        (a, b) => new Date(b.date_time) - new Date(a.date_time)
      );
    }
    // TODO - distance sort (2 and 3)
    this.setState({ filteredHireRequests });
  }

  render() {
    const {
      filteredHireRequests,
      filteredOn,
      showHelpers,
      showEmployers,
      equipment,
      skills,
      currentUser,
    } = this.state;
    const select = (
      <Form.Select
        aria-label="Sort By"
        onChange={(e) => this.sortBy(e.target.value)}
      >
        <option key="0" value={0}>
          Sort by Soonest
        </option>
        <option key="1" value={1}>
          Sort by Latest
        </option>
        <option key="2" value={2}>
          Sort by Closest
        </option>
        <option key="3" value={3}>
          Sort by Farthest
        </option>
      </Form.Select>
    );
    return (
      <>
        <Search filter={this.filterType} filteredOn={filteredOn} />

        <Form>
          <Row>
            <Col md={6}>
              <h3>Found {filteredHireRequests.length} results</h3>
            </Col>
            <Col md={2}>
              <Form.Check
                id="showHelpers"
                label="Show Helpers"
                checked={showHelpers}
                onChange={(e) => this.filterWhat(e, showHelpers)}
              />
            </Col>
            <Col md={2}>
              <Form.Check
                id="showEmployers"
                label="Show Employers"
                checked={showEmployers}
                onChange={(e) => this.filterWhat(e, showEmployers)}
              />
            </Col>
            <Col md={2}>{select}</Col>
          </Row>
        </Form>

        {filteredHireRequests.map((hireRequest) => (
          <RequestToHire
            key={hireRequest.id}
            currentUser={currentUser}
            hireRequest={hireRequest}
            equipment={equipment}
            skills={skills}
          />
        ))}
      </>
    );
  }
}

export default HomePage;
