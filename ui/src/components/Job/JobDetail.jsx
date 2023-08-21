import React from 'react';
import { Row } from 'react-bootstrap';
import SnnapFormInput from '../SnnapForms/SnnapFormInput';
import SnnapFormTextarea from '../SnnapForms/SnnapFormTextarea';

function JobDetail(props) {
  const { job } = props;

  return (
    <>
      <Row className="mb-3">
        <h2 className="h3">Job Information</h2>
      </Row>
      <Row className="mb-3">
        <SnnapFormInput size={6} name="Job Type" value={job.type} disabled />
        <SnnapFormInput
          size={6}
          name="Looking For"
          value={job.subtype}
          disabled
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={8}
          name="City"
          value={
            job.loc ? job.loc.replace(', United States of America', '') : ' '
          }
          disabled
        />
        <SnnapFormInput
          size={4}
          name="Date"
          value={
            job.date_time
              ? new Intl.DateTimeFormat('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                }).format(new Date(job.date_time))
              : ' '
          }
          disabled
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={6}
          name="Desired Equipment"
          value={job.equipment ? job.equipment : ' '}
          disabled
        />
        <SnnapFormInput
          size={6}
          name="Skills Required"
          value={
            job.skills && job.skills.length
              ? job.skills.map((option) => option.name).join(', ')
              : ' '
          }
          disabled
        />
      </Row>
      <Row className="mb-3">
        <SnnapFormTextarea name="Job Details" value={job.details} disabled />
      </Row>
      <Row className="mb-3">
        <SnnapFormInput
          size={6}
          name="Duration"
          value={`${job.duration}${
            job.durationMax ? ` to ${job.durationMax}` : ''
          } hours`}
          disabled
        />
        <SnnapFormInput
          size={6}
          name="Pay"
          value={`$${job.pay} per hour`}
          disabled
        />
      </Row>
    </>
  );
}

export default JobDetail;
