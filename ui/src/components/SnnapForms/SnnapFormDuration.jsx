import { Button, Col, Form, InputGroup } from 'react-bootstrap';
import React, { useState } from 'react';
import './SnnapForm.css';

function SnnapFormDuration(props) {
  const [range, setRange] = useState(false);

  const { size, name, onChange } = props;
  if (!name) {
    return null;
  }
  const safeName = name.replace(/\W+/g, '');
  let change = null;
  let changeRange = null;
  if (onChange) {
    change = (e) => onChange(name, e.target.value);
    changeRange = (e) => onChange(`${name}Range`, e.target.value);
  }
  const inputForm = (
    <Form.Control
      required
      type="number"
      step={0.25}
      min={0}
      placeholder={name}
      aria-describedby={`inputGroup${safeName}`}
      onChange={change}
    />
  );
  let formControl = inputForm;
  if (range) {
    formControl = (
      <>
        {inputForm}
        <InputGroup.Text id={`inputGroupTo${safeName}`}>to</InputGroup.Text>
        <Form.Control
          required
          type="number"
          step={0.25}
          min={0}
          placeholder={`${name} Range`}
          aria-describedby={`inputGroup${safeName}`}
          onChange={changeRange}
        />
      </>
    );
  }
  const formError = (
    <Form.Control.Feedback type="invalid">
      Please provide a valid {name.toLowerCase()}.
    </Form.Control.Feedback>
  );

  return (
    <Form.Group as={Col} md={size} controlId={`form${safeName}`}>
      <InputGroup hasValidation>
        {formControl}
        <InputGroup.Text id={`inputGroupPost${safeName}`}>
          Hours
        </InputGroup.Text>
        <Button
          variant="outline-secondary"
          id={`setRange${safeName}`}
          onClick={() => {
            setRange(!range);
            if (range) {
              onChange(`${name}Range`, null);
            }
          }}
        >
          Range
        </Button>
        {formError}
      </InputGroup>
    </Form.Group>
  );
}

SnnapFormDuration.defaultProps = {
  size: 12,
};

export default SnnapFormDuration;
