import { Col, Form, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Facebook, Globe, Instagram } from 'react-bootstrap-icons';
import SnnapFormInput from '../../SnnapForms/SnnapFormInput';
import SnnapFormMultiSelect from '../../SnnapForms/SnnapFormMultiSelect';
import Submit from '../../Submit/Submit';
import { companyService } from '../../../services/company.service';
import { jobService } from '../../../services/job.service';
import './CompanyInformation.css';

function CompanyInformation(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState(null);
  const [update, setUpdate] = useState(null);
  const [formData, setFormData] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [skills, setSkills] = useState([]);
  const { company } = props;

  useEffect(() => {
    jobService.getEquipment().then((equipment) => {
      setEquipment(equipment);
    });
    jobService.getSkills().then((skills) => {
      setSkills(skills);
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
          setIsSubmitting(false);
          setStatus(null);
          setUpdate('Company Information Updated');
          setTimeout(() => {
            setUpdate(null);
            setValidated(false);
          }, 5000);
        },
        (error) => {
          setIsSubmitting(false);
          setStatus(error.toString());
        }
      );
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
        <Col md={2}>
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
        <Col md={2}>
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
        <Col md={2}>
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
        <SnnapFormMultiSelect
          name="Equipment"
          values={company.equipment}
          onChange={updateForm}
          options={equipment}
        />
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
