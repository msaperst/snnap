import React, { useEffect, useRef } from 'react';
import { Col, FloatingLabel, Form } from 'react-bootstrap';
import './SnnapForm.css';

function SnnapFormTextarea(props) {
  const { size, name, id, value, onChange, disabled, notRequired } = props;

  const ref = useRef(null);
  useEffect(() => {
    if (name) {
      ref.current.style.height = '';
      ref.current.style.height = `${ref.current.scrollHeight + 2}px`;
    }
  }, [name]);

  if (!name) {
    return null;
  }
  const safeName = name.replace(/\W/gi, '');
  let controlId = `form${safeName}`;
  if (id) {
    controlId = id;
  }

  let change = null;
  if (onChange) {
    let key = name;
    if (id) {
      key = id;
    }
    change = (e) => {
      e.target.style.height = '';
      e.target.style.height = `${e.target.scrollHeight + 2}px`;
      onChange(key, e.target.value);
    };
  }

  let required = true;
  if (notRequired) {
    required = false;
  }

  const formControl = (
    <Form.Control
      required={required}
      as="textarea"
      placeholder={name}
      onChange={change}
      disabled={disabled}
      defaultValue={value}
      ref={ref}
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

SnnapFormTextarea.defaultProps = {
  size: 12,
  type: 'text',
};

export default SnnapFormTextarea;
