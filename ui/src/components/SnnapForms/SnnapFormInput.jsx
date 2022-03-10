import { Col, FloatingLabel, Form } from 'react-bootstrap';
import React from 'react';
import './SnnapForm.css';

function SnnapFormInput(props) {
  const { size, name, value, type, onChange, readOnly } = props;
  if (!name) {
    return null;
  }
  const safeName = name.replace(/[\W]+/g, '');
  let as;
  if (type === 'textarea') {
    as = type;
  }
  let change = null;
  if (onChange) {
    change = (e) => onChange(name, e.target.value);
  }
  const formControl = (
    <Form.Control
      required
      type={type}
      as={as}
      placeholder={name}
      onChange={change}
      readOnly={readOnly}
      defaultValue={value}
    />
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

SnnapFormInput.defaultProps = {
  size: 12,
  type: 'text',
};

export default SnnapFormInput;
