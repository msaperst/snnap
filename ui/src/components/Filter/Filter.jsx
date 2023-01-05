import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { jobService } from '../../services/job.service';
import { usePosition } from '../../helpers/usePosition';
import Job from '../Job/Job';
import './Filter.css';

function Filter(props) {
  const distances = [5, 25, 100, 250];
  const locations = ['my home', 'my location', 'custom'];

  const { currentUser, filter } = props;
  const { latitude, longitude } = usePosition();

  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobSubtypes, setJobSubtypes] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [skills, setSkills] = useState([]);
  const [distance, setDistance] = useState(distances[1]);
  const [location, setLocation] = useState(currentUser);
  const [currentLocation, setCurrentLocation] = useState({});
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedJobSubtypes, setSelectedJobSubtypes] = useState([]);
  const [savedFilters, setSavedFilters] = useState({
    jobTypes: [1],
    jobSubtypes: [1],
  });

  const [showOwnLocation, setShowOwnLocation] = useState(false);

  useEffect(() => {
    const cookies = JSON.parse(localStorage.getItem('cookies'));
    const lastFilters = JSON.parse(localStorage.getItem('filters'));
    if ((!cookies || cookies.preferences) && lastFilters) {
      setSavedFilters(lastFilters);
      setSelectedJobTypes(lastFilters.jobTypes);
      setSelectedJobSubtypes(lastFilters.jobSubtypes);
    } else {
      setSelectedJobTypes(savedFilters.jobTypes);
      setSelectedJobSubtypes(savedFilters.jobSubtypes);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (currentUser.token) {
      const ws = new WebSocket(
        `${process.env.REACT_APP_WS_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_WS_PORT}/wsapp/jobs?token=${currentUser.token}`
      );
      ws.onopen = () => {
        // receive messages
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (
            isMounted &&
            Array.isArray(message) &&
            message.length !== allJobs.length
          ) {
            setAllJobs(message);
            setFilteredJobs(message);
          }
        };
      };
      return () => {
        ws.close();
      };
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser, allJobs]);

  useEffect(() => {
    let isMounted = true;
    jobService.getJobTypes().then((jobs) => {
      if (isMounted) {
        setJobTypes(jobs);
      }
    });
    jobService.getJobSubtypes().then((jobs) => {
      if (isMounted) {
        setJobSubtypes(jobs);
      }
    });
    jobService.getEquipment().then((e) => {
      if (isMounted) {
        setEquipment(e);
      }
    });
    jobService.getSkills().then((s) => {
      if (isMounted) {
        setSkills(s);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentLocation({ lat: latitude, lon: longitude });
  }, [longitude, latitude]);

  useEffect(() => {
    let isMounted = true;
    // start out with everything
    let jobs = allJobs;
    // remove elements not in our job type
    if (filter) {
      jobs = jobs.filter((job) =>
        job.details.toLowerCase().includes(filter.toLowerCase())
      );
    }
    // remove jobs based on selected job types
    jobs = jobs.filter((job) => selectedJobTypes.includes(job.typeId));
    // remove jobs based on selected job subtypes
    jobs = jobs.filter((job) => selectedJobSubtypes.includes(job.subtypeId));
    // filter out ones outside our location
    jobs = jobs.filter((job) => distance >= calculateDistance(location, job));
    // set our new values;
    if (isMounted) {
      setFilteredJobs(jobs);
    }
    return () => {
      isMounted = false;
    };
  }, [
    allJobs,
    filter,
    distance,
    location,
    selectedJobTypes,
    selectedJobSubtypes,
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
      case 'my location':
        setLocation(currentLocation);
        break;
      case 'custom':
        setLocation({ lat: 0, lon: 0 });
        setShowOwnLocation(true);
        break;
      default:
        setLocation(currentUser); // also works for 'my home'
    }
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
    let jobTypes;
    if (selectedJobTypes.includes(value)) {
      for (let i = 0; i < selectedJobTypes.length; i++) {
        if (selectedJobTypes[i] === value) {
          jobTypes = [
            ...selectedJobTypes.slice(0, i),
            ...selectedJobTypes.slice(i + 1, selectedJobTypes.length),
          ];
          break;
        }
      }
    } else {
      jobTypes = [...selectedJobTypes, value];
    }
    // store our values
    const cookies = JSON.parse(localStorage.getItem('cookies'));
    if (!cookies || cookies.preferences) {
      const lastFilters = { ...savedFilters, jobTypes };
      setSavedFilters(lastFilters);
      localStorage.setItem('filters', JSON.stringify(lastFilters));
    }
    setSelectedJobTypes(jobTypes);
  };

  const updateSubtypes = (value) => {
    let jobSubtypes;
    if (selectedJobSubtypes.includes(value)) {
      for (let i = 0; i < selectedJobSubtypes.length; i++) {
        if (selectedJobSubtypes[i] === value) {
          jobSubtypes = [
            ...selectedJobSubtypes.slice(0, i),
            ...selectedJobSubtypes.slice(i + 1, selectedJobSubtypes.length),
          ];
          break;
        }
      }
    } else {
      jobSubtypes = [...selectedJobSubtypes, value];
    }
    // store our values
    const cookies = JSON.parse(localStorage.getItem('cookies'));
    if (!cookies || cookies.preferences) {
      const lastFilters = { ...savedFilters, jobSubtypes };
      setSavedFilters(lastFilters);
      localStorage.setItem('filters', JSON.stringify(lastFilters));
    }
    setSelectedJobSubtypes(jobSubtypes);
  };

  return (
    <>
      <Form>
        <Row className="mb-1">
          <Col style={{ zIndex: 1 }}>
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
        <Row className="mb-5">
          <Col>
            {jobSubtypes.map((type) => (
              <Button
                className="btn-filter"
                key={type.id}
                variant={
                  selectedJobSubtypes.includes(type.id)
                    ? 'primary'
                    : 'secondary'
                }
                onClick={() => updateSubtypes(type.id)}
              >
                {type.plural}
              </Button>
            ))}
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <h2 className="h3">
              Found {filteredJobs.length} Job
              {filteredJobs.length !== 1 ? 's' : ''}
            </h2>
          </Col>
          <Col md={3} />
          <Col md={5} className="text-end">
            <Form.Select
              id="select-mileage"
              className="small-select"
              aria-label="Within Miles"
              value={distance}
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
              <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
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
      {filteredJobs.map((job) => (
        <Job
          key={job.id}
          currentUser={currentUser}
          job={job}
          equipment={equipment}
          skills={skills}
        />
      ))}
    </>
  );
}

export default Filter;
