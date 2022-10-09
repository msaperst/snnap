import React from 'react';
import { Row } from 'react-bootstrap';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';

function JobDetail(props) {
  const { job } = props;

  return (
    <>
      <Row className="mb-3">
        <h3>Job Information</h3>
      </Row>
      <Row className="mb-3">
        <SnnapFormInput size={4} name="Job Type" value={job.type} disabled />
        <SnnapFormInput
          size={4}
          name="Date"
          value={new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
          }).format(new Date(job.date_time))}
          disabled
        />
        <SnnapFormInput
          size={4}
          name="Duration"
          value={`${job.duration}${
            job.durationMax ? ` to ${job.durationMax}` : ''
          } hours`}
          disabled
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={8}
          name="City"
          value={job.loc.replace(', United States of America', '')}
          disabled
        />
        <SnnapFormInput
          size={4}
          name="Pay"
          value={`$${job.pay} per hour`}
          disabled
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          name="Job Details"
          value={job.details}
          type="textarea"
          disabled
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={6}
          name="Equipment"
          value={
            job.equipment
              ? job.equipment.map((option) => option.name).toString()
              : ''
          }
          disabled
        />
        <SnnapFormInput
          size={6}
          name="Skills"
          value={
            job.skills ? job.skills.map((option) => option.name).toString() : ''
          }
          disabled
        />
      </Row>
    </>
  );
}

export default JobDetail;