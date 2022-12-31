import React, { useState, useEffect, useRef } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Form, Modal, Row } from 'react-bootstrap';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import SnnapFormPrice from '../SnnapForms/SnnapFormPrice';
import SnnapFormMultiSelect from '../SnnapForms/SnnapFormMultiSelect';
import SnnapFormLocationInput from '../SnnapForms/SnnapFormLocationInput';
import SnnapFormSelect from '../SnnapForms/SnnapFormSelect';
import SnnapFormDuration from '../SnnapForms/SnnapFormDuration';
import SnnapFormTextarea from '../SnnapForms/SnnapFormTextarea';
import Submit from '../Submit/Submit';
import { jobService } from '../../services/job.service';
import { commonFormComponents } from '../CommonFormComponents';

function NewJob() {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [jobTypes, setJobTypes] = useState([]);
  const [jobSubtypes, setJobSubtypes] = useState([]);
  const [jobSkills, setJobSkills] = useState([]);
  const isMountedVal = useRef(true);

  useEffect(() => {
    isMountedVal.current = true;
    jobService.getJobTypes().then((types) => {
      if (isMountedVal.current) {
        setJobTypes(types);
      }
    });
    jobService.getJobSubtypes().then((subtypes) => {
      if (isMountedVal.current) {
        setJobSubtypes(subtypes);
      }
    });
    jobService.getSkills().then((skills) => {
      if (isMountedVal.current) {
        setJobSkills(skills);
      }
    });
    return () => {
      isMountedVal.current = false;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = document.querySelector('#newJobForm');
    const city = document.querySelector('#formCity');
    const date = document.querySelector('#formDate');
    city.setCustomValidity('');
    date.setCustomValidity('');
    setValidated(true);
    // actually check and submit the form
    if (form.checkValidity() === true) {
      // custom checks - should match API checks
      let isValid = true;
      isValid = checkLocation(city) && isValid;
      isValid = checkDate(date) && isValid;
      if (!isValid) {
        return;
      }
      setIsSubmitting(true);
      jobService
        .newJob(
          formData['Job Type'],
          formData['Looking For'],
          {
            lat: formData.City.properties.lat,
            lon: formData.City.properties.lon,
            loc: formData.City.properties.formatted,
          },
          formData['Job Details'],
          formData.Pay,
          formData.Duration,
          formData.DurationRange,
          formData.Date,
          formData.Time,
          formData['Desired Equipment'],
          formData['Skills Required']
        )
        .then(
          () => {
            commonFormComponents.setSuccess(
              setStatus,
              setUpdate,
              'New Job Submitted',
              setIsSubmitting,
              setShow,
              setValidated
            );
          },
          (error) => {
            setStatus(error.toString());
            setUpdate(null);
            setIsSubmitting(false);
          }
        );
    }
  };

  function checkDate(date) {
    const input = Date.parse(formData.Date);
    const startOfToday = new Date().setHours(-5, 0, 0, 0);
    if (input < startOfToday) {
      setStatus('Please provide a date today or later.');
      date.setCustomValidity('Invalid field.');
      return false;
    }
    return true;
  }

  function checkLocation(city) {
    if (
      !(
        formData.City &&
        formData.City.properties &&
        formData.City.properties.formatted
      )
    ) {
      setStatus('Please select a valid city from the drop down.');
      city.setCustomValidity('Invalid field.');
      return false;
    }
    return true;
  }

  const updateForm = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <>
      <div>
        <NavDropdown.Item
          id="openNewJobButton"
          onClick={() => {
            setValidated(false);
            setShow(true);
            commonFormComponents.setPageView('new-job');
          }}
        >
          Create New Job
        </NavDropdown.Item>
      </div>
      <Modal
        size="lg"
        show={show}
        onHide={() => {
          setShow(false);
          commonFormComponents.setPageView();
        }}
        data-testid="newJobModal"
        aria-label="Create New Job"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a new job</Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Form
            id="newJobForm"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Row className="mb-3">
              <SnnapFormSelect
                name="Job Type"
                onChange={updateForm}
                options={jobTypes}
              />
            </Row>
            <Row className="mb-3">
              <SnnapFormSelect
                name="Looking For"
                onChange={updateForm}
                options={jobSubtypes}
              />
            </Row>
            <Row className="mb-3">
              <SnnapFormLocationInput
                name="City"
                size={8}
                onChange={updateForm}
              />
              <SnnapFormInput
                size={4}
                name="Date"
                type="date"
                value="yyyy-mm-dd"
                onChange={updateForm}
              />
            </Row>
            <Row className="mb-3">
              <SnnapFormInput
                size={6}
                name="Desired Equipment"
                onChange={updateForm}
                notRequired
              />
              <SnnapFormMultiSelect
                size={6}
                name="Skills Required"
                onChange={updateForm}
                options={jobSkills}
              />
            </Row>
            <Row className="mb-3">
              <SnnapFormTextarea name="Job Details" onChange={updateForm} />
            </Row>
            <Row className="mb-3">
              <SnnapFormDuration
                size={6}
                type="number"
                name="Duration"
                options={['Minutes', 'Hours', 'Days']}
                onChange={updateForm}
              />
              <SnnapFormPrice size={6} name="Pay" onChange={updateForm} />
            </Row>
            <Submit
              buttonText="Create New Request"
              isSubmitting={isSubmitting}
              error={status}
              updateError={setStatus}
              success={update}
              updateSuccess={setUpdate}
            />
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NewJob;
