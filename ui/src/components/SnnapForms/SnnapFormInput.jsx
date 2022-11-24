import { Col, FloatingLabel, Form } from 'react-bootstrap';
import React from 'react';
import './SnnapForm.css';

function SnnapFormInput(props) {
  const {
    size,
    name,
    id,
    value,
    type,
    onChange,
    disabled,
    notRequired,
    currentVal,
  } = props;
  if (!name) {
    return null;
  }
  const safeName = name.replace(/\W/gi, '');
  let controlId = `form${safeName}`;
  if (id) {
    controlId = id;
  }
  let as;
  if (type === 'textarea') {
    as = type;
  }
  let change = null;
  if (onChange) {
    let key = name;
    if (id) {
      key = id;
    }
    change = (e) => onChange(key, e.target.value);
  }
  let required = true;
  if (notRequired) {
    required = false;
  }
  const formControl = (
    <Form.Control
      required={required}
      type={type}
      as={as}
      placeholder={name}
      onChange={change}
      disabled={disabled}
      defaultValue={value}
      value={currentVal}
    />
  );
  const formError = (
    <Form.Control.Feedback type="invalid">
      Please provide a valid {name.toLowerCase()}.
    </Form.Control.Feedback>
  );

  return (
    <Form.Group as={Col} md={size} controlId={controlId}>
      <FloatingLabel controlId={controlId} label={name}>
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
