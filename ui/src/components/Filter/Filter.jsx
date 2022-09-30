import { Button, Col, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { jobService } from '../../services/job.service';
import { usePosition } from '../../helpers/usePosition';
import RequestToHire from '../RequestToHire/RequestToHire';
import './Filter.css';

function Filter(props) {
  const distances = [5, 25, 100, 250];
  const locations = ['my home', 'me', 'other'];

  const { currentUser, filter } = props;
  const { latitude, longitude } = usePosition();

  const [allHireRequests, setAllHireRequests] = useState([]);
  const [filteredHireRequests, setFilteredHireRequests] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [skills, setSkills] = useState([]);
  const [distance, setDistance] = useState(distances[0]);
  const [location, setLocation] = useState(locations[0]);
  const [currentLocation, setCurrentLocation] = useState({});
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  useEffect(() => {
    jobService.getJobTypes().then((jobs) => {
      setJobTypes(jobs);
      setSelectedJobTypes(jobs.map((item) => item.id));
    });
    jobService.getEquipment().then((e) => {
      setEquipment(e);
    });
    jobService.getSkills().then((s) => {
      setSkills(s);
    });
    jobService.getHireRequests().then((hr) => {
      setAllHireRequests(hr);
      setFilteredHireRequests(hr);
    });
  }, []);

  useEffect(() => {
    setCurrentLocation({ lat: latitude, lon: longitude });
  }, [longitude, latitude]);

  useEffect(() => {
    updateResults();
  }, [
    allHireRequests,
    filter,
    distance,
    location,
    selectedJobTypes,
    currentLocation,
  ]);

  const updateResults = () => {
    // start out empty
    let hireRequests = allHireRequests;

    // remove elements not in our job type
    if (filter) {
      hireRequests = hireRequests.filter((hireRequest) =>
        hireRequest.details.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // remove hireRequests based on selected job types
    hireRequests = hireRequests.filter((hireRequest) =>
      selectedJobTypes.includes(hireRequest.typeId)
    );

    // determine which location to use
    let whichLocation;
    switch (location) {
      case 'my home':
        whichLocation = currentUser;
        break;
      case 'me':
        whichLocation = currentLocation;
        break;
      case 'other':
        whichLocation = { lat: 10, lon: 5 };
        break;
      default:
        whichLocation = currentUser;
    }

    // filter out ones outside our location
    hireRequests = hireRequests.filter(
      (hireRequest) => distance >= calculateDistance(whichLocation, hireRequest)
    );

    // set our new values;
    setFilteredHireRequests(hireRequests);
  };

  const calculateDistance = (p1, p2) => {
    // This uses the ‘haversine’ formula to calculate the great-circle distance between
    // two points – that is, the shortest distance over the earth’s surface – giving an
    // ‘as-the-crow-flies’ distance between the points (ignoring any hills they fly over, of course!).
    const R = 3959; // miles
    const φ1 = (p1.lat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (p2.lat * Math.PI) / 180;
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
    const Δλ = ((p2.lon - p1.lon) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in miles
  };

  const updateTypes = (value) => {
    if (selectedJobTypes.includes(value)) {
      for (let i = 0; i < selectedJobTypes.length; i++) {
        if (selectedJobTypes[i] === value) {
          setSelectedJobTypes([
            ...selectedJobTypes.slice(0, i),
            ...selectedJobTypes.slice(i + 1, selectedJobTypes.length),
          ]);
          break;
        }
      }
    } else {
      setSelectedJobTypes([...selectedJobTypes, value]);
    }
  };

  return (
    <>
      <Form>
        <Row className="mb-5">
          <Col>
            Show:
            {jobTypes.map((type) => (
              <Button
                className="btn-filter"
                key={type.id}
                variant={
                  selectedJobTypes.includes(type.id) ? 'primary' : 'secondary'
                }
                onClick={() => updateTypes(type.id)}
              >
                {type.plural}
              </Button>
            ))}
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <h3>Found {filteredHireRequests.length} Jobs</h3>
          </Col>
          <Col md={4} />
          <Col md={4} className="text-end">
            <Form.Select
              className="small-select"
              aria-label="Within Miles"
              onChange={(e) => {
                setDistance(e.target.value);
              }}
            >
              {distances.map((d) => (
                <option key={d} value={d}>
                  Within {d} miles
                </option>
              ))}
            </Form.Select>{' '}
            of{' '}
            <Form.Select
              className="small-select"
              aria-label="Where At"
              onChange={(e) => {
                setLocation(e.target.value);
              }}
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Form.Select>
          </Col>
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

export default Filter;
