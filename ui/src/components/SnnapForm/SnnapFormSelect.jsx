import { Col, FloatingLabel, Form } from 'react-bootstrap';
import React from 'react';
import './SnnapForm.css';

function SnnapFormSelect(props) {
  const { size, name, onChange, options } = props;
  if (!name || !options || options.length === 0) {
    return null;
  }
  const safeName = name.replace(/[\W]+/g, '');
  let change = null;
  if (onChange) {
    change = (e) => onChange(name, e.target.value);
  }
  const formControl = (
    <Form.Select required aria-label={name} onChange={change}>
      <option>Select an option</option>
      {options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </Form.Select>
  );
  const formError = (
    <Form.Control.Feedback type="invalid">
      Please provide a valid {name.toLowerCase()}.
    </Form.Control.Feedback>
  );

  return (
    <Form.Group as={Col} md={size} controlId={`form${safeName}`}>
      <FloatingLabel controlId={`form${safeName}`} label={name}>
        {formControl}
        {formError}
      </FloatingLabel>
    </Form.Group>
  );
}

SnnapFormSelect.defaultProps = {
  size: 12,
};

export default SnnapFormSelect;
