import { Button, Col, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
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
  const [location, setLocation] = useState(currentUser);
  const [currentLocation, setCurrentLocation] = useState({});
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  const [showOwnLocation, setShowOwnLocation] = useState(false);

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

  useEffect(() => {
    if (showOwnLocation) {
      // fix some styling
      const input = document.querySelector('.geoapify-autocomplete-input');
      input.className = 'form-control small-select';
      const parent = input.parentNode;
      parent.style.float = 'right';
      parent.style.color = 'black';
    }
  }, [showOwnLocation]);

  const selectFilterLocation = (value) => {
    // determine which location to use
    switch (value) {
      case 'me':
        setLocation(currentLocation);
        break;
      case 'other':
        setLocation({ lat: 0, lon: 0 });
        setShowOwnLocation(true);
        break;
      default:
        setLocation(currentUser); // also works for 'my home'
    }
  };

  const updateResults = () => {
    // start out with everything
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
    // filter out ones outside our location
    hireRequests = hireRequests.filter(
      (hireRequest) => distance >= calculateDistance(location, hireRequest)
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
            <h3>
              Found {filteredHireRequests.length} Job
              {filteredHireRequests.length !== 1 ? 's' : ''}
            </h3>
          </Col>
          <Col md={3} />
          <Col md={5} className="text-end">
            <Form.Select
              id="select-mileage"
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
            {!showOwnLocation && (
              <Form.Select
                id="select-location"
                className="small-select"
                aria-label="Where At"
                onChange={(e) => selectFilterLocation(e.target.value)}
              >
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Form.Select>
            )}
            {showOwnLocation && (
              <GeoapifyContext apiKey="fa2749a615994e459a223b8cb3832599">
                <GeoapifyGeocoderAutocomplete
                  className="123"
                  placeholder="Enter City"
                  type="city"
                  skipIcons
                  placeSelect={(e) => setLocation(e.properties)}
                />
              </GeoapifyContext>
            )}
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
