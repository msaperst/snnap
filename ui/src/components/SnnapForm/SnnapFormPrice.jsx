import { Col, Form, InputGroup } from 'react-bootstrap';
import React from 'react';
import './SnnapForm.css';

function SnnapFormPrice(props) {
  const { size, name, onChange } = props;
  if (!name) {
    return null;
  }
  const safeName = name.replace(/[\W]+/g, '');
  let change = null;
  if (onChange) {
    change = (e) => onChange(name, e.target.value);
  }
  const formControl = (
    <Form.Control
      required
      type="number"
      step={0.01}
      min={0}
      placeholder={name}
      aria-describedby={`inputGroup${safeName}`}
      onChange={change}
    />
  );
  const formError = (
    <Form.Control.Feedback type="invalid">
      Please provide a valid {name.toLowerCase()}.
    </Form.Control.Feedback>
  );

  return (
    <Form.Group as={Col} md={size} controlId={`form${safeName}`}>
      <InputGroup hasValidation>
        <InputGroup.Text id={`inputGroup${safeName}`}>$</InputGroup.Text>
        {formControl}
        {formError}
      </InputGroup>
    </Form.Group>
  );
}

SnnapFormPrice.defaultProps = {
  size: 12,
};

export default SnnapFormPrice;
