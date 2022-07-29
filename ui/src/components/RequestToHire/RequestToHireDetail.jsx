import React from 'react';
import { Row } from 'react-bootstrap';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';

function RequestToHireDetail(props) {
  const { hireRequest } = props;

  return (
    <>
      <Row className="mb-3">
        <h3>Job Information</h3>
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={4}
          name="Job Type"
          value={hireRequest.type}
          readOnly
        />
        <SnnapFormInput
          size={4}
          name="Date"
          value={new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
          }).format(new Date(hireRequest.date_time))}
          readOnly
        />
        <SnnapFormInput
          size={4}
          name="Duration"
          value={`${hireRequest.duration}${
            hireRequest.durationMax ? ` to ${hireRequest.durationMax}` : ''
          } hours`}
          readOnly
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={8}
          name="Location"
          value={hireRequest.location.replace(', United States of America', '')}
          readOnly
        />
        <SnnapFormInput
          size={4}
          name="Pay"
          value={`$${hireRequest.pay} per hour`}
          readOnly
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          name="Job Details"
          value={hireRequest.details}
          type="textarea"
          readOnly
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={6}
          name="Equipment"
          value={
            hireRequest.equipment
              ? hireRequest.equipment.map((option) => option.name).toString()
              : ''
          }
          readOnly
        />
        <SnnapFormInput
          size={6}
          name="Skills"
          value={
            hireRequest.skills
              ? hireRequest.skills.map((option) => option.name).toString()
              : ''
          }
          readOnly
        />
      </Row>
    </>
  );
}

export default RequestToHireDetail;
