import { Col, Form, InputGroup } from 'react-bootstrap';
import React from 'react';

function SnnapFormInput(props) {
  const { size, name, type, before, after } = props;
  let prepend = '';
  let append = '';
  let formControl = <Form.Control required type={type} placeholder={name} />;
  if (before) {
    prepend = (
      <InputGroup.Text id={`inputGroup${name.replace(/[\W]+/g, '')}`}>
        {before}
      </InputGroup.Text>
    );
    formControl = (
      <Form.Control
        required
        type={type}
        placeholder={name}
        aria-describedby={`inputGroup${name.replace(/[\W]+/g, '')}`}
      />
    );
  }
  if (after) {
    append = (
      <InputGroup.Text id={`inputGroup${name.replace(/[\W]+/g, '')}`}>
        {after}
      </InputGroup.Text>
    );
    formControl = (
      <Form.Control
        required
        type={type}
        placeholder={name}
        aria-describedby={`inputGroup${name.replace(/[\W]+/g, '')}`}
      />
    );
  }
  return (
    <Form.Group
      as={Col}
      md={size}
      controlId={`validation${name.replace(/[\W]+/g, '')}`}
    >
      <Form.Label>{name}</Form.Label>
      <InputGroup hasValidation>
        {prepend}
        {formControl}
        {append}
        <Form.Control.Feedback type="invalid">
          Please provide a valid {name.toLowerCase()}.
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
}

export default SnnapFormInput;
