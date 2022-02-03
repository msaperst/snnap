import { Col, Form, InputGroup } from 'react-bootstrap';
import React from 'react';

function SnnapFormInput(props) {
  const { size, name, type, before, after } = props;
  if (name === undefined) {
    return null;
  }
  let prepend = '';
  let append = '';
  let formControl = <Form.Control required type={type} placeholder={name} />;
  const formLabel = <Form.Label>{name}</Form.Label>;
  const formError = (
    <Form.Control.Feedback type="invalid">
      Please provide a valid {name.toLowerCase()}.
    </Form.Control.Feedback>
  );
  if (before) {
    prepend = (
      <InputGroup.Text id={`inputGroup${name.replace(/[\W]+/g, '')}`}>
        {before}
      </InputGroup.Text>
    );
  }
  if (after) {
    append = (
      <InputGroup.Text id={`inputGroup${name.replace(/[\W]+/g, '')}`}>
        {after}
      </InputGroup.Text>
    );
  }
  if (before || after) {
    formControl = (
      <Form.Control
        required
        type={type}
        placeholder={name}
        aria-describedby={`inputGroup${name.replace(/[\W]+/g, '')}`}
      />
    );
    return (
      <Form.Group
        as={Col}
        md={size}
        controlId={`validation${name.replace(/[\W]+/g, '')}`}
      >
        {formLabel}
        <InputGroup hasValidation>
          {prepend}
          {formControl}
          {append}
          {formError}
        </InputGroup>
      </Form.Group>
    );
  }
  return (
    <Form.Group
      as={Col}
      md={size}
      controlId={`validation${name.replace(/[\W]+/g, '')}`}
    >
      {formLabel}
      {formControl}
      {formError}
    </Form.Group>
  );
}

export default SnnapFormInput;

SnnapFormInput.defaultProps = {
  size: 12,
  type: 'text',
};
