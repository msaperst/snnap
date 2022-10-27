import { Col, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import SnnapFormMultiSelect from '../../SnnapForms/SnnapFormMultiSelect';
import Submit from '../../Submit/Submit';
import { companyService } from '../../../services/company.service';
import { jobService } from '../../../services/job.service';
import './CompanyInformation.css';
import EquipmentSelect from './EquipmentSelect/EquipmentSelect';
import { commonFormComponents } from '../../CommonFormComponents';

function CompanyInformation(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState(null);
  const [skills, setSkills] = useState([]);
  const { company } = props;

  useEffect(() => {
    jobService.getSkills().then((s) => {
      setSkills(s);
    });
    if (company) {
      setFormData({
        'Company Name': company.name,
        Website: company.website,
        'Instagram Link': company.insta,
        'Facebook Link': company.fb,
        Equipment: company.equipment || [],
        Skills: company.skills || [],
      });
    }
  }, [company]);

  if (company === undefined) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      setIsSubmitting(true);
      companyService
        .updateCompanyInformation(
          formData['Company Name'],
          !formData.Website || formData.Website === ''
            ? undefined
            : formData.Website,
          !formData['Instagram Link'] || formData['Instagram Link'] === ''
            ? undefined
            : formData['Instagram Link'],
          !formData['Facebook Link'] || formData['Facebook Link'] === ''
            ? undefined
            : formData['Facebook Link'],
          formData.Equipment,
          formData.Skills
        )
        .then(
          () => {
            commonFormComponents.setBasicSuccess(
              setIsSubmitting,
              setStatus,
              setUpdate,
              setValidated,
              'Company Information Updated'
            );
          },
          (error) => {
            setIsSubmitting(false);
            setStatus(error.toString());
          }
        );
    }
  };

  const updateForm = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h3>Company Information</h3>
      <Row className="mb-3">
        <SnnapFormInput
          name="Company Name"
          value={company.name}
          onChange={updateForm}
          notRequired
        />
      </Row>
      <Row className="mb-3">
        <Col md={2} className="d-md-block d-sm-none d-none">
          <Globe className="icon" />
        </Col>
        <SnnapFormInput
          name="Website"
          size={10}
          value={company.website}
          onChange={updateForm}
          notRequired
        />
      </Row>
      <Row className="mb-3">
        <Col md={2} className="d-md-block d-sm-none d-none">
          <Instagram className="icon" />
        </Col>
        <SnnapFormInput
          name="Instagram Link"
          size={10}
          value={company.insta}
          onChange={updateForm}
          notRequired
        />
      </Row>
      <Row className="mb-3">
        <Col md={2} className="d-md-block d-sm-none d-none">
          <Facebook className="icon" />
        </Col>
        <SnnapFormInput
          name="Facebook Link"
          size={10}
          value={company.fb}
          onChange={updateForm}
          notRequired
        />
      </Row>
      <Row className="mb-3">
        <EquipmentSelect onChange={updateForm} company={company} />
      </Row>
      <Row className="mb-3">
        <SnnapFormMultiSelect
          name="Skills"
          values={company.skills}
          onChange={updateForm}
          options={skills}
        />
      </Row>
      <Submit
        buttonText="Save Company Information"
        isSubmitting={isSubmitting}
        error={status}
        updateError={setStatus}
        success={update}
        updateSuccess={setUpdate}
      />
    </Form>
  );
}

export default CompanyInformation;
