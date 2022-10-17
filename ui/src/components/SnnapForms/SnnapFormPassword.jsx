import { Col, FloatingLabel, Form } from 'react-bootstrap';
import React, { useRef } from 'react';
import './SnnapForm.css';

function SnnapFormPassword(props) {
  const { size, name, id, value, onChange } = props;
  const ref = useRef(null);
  if (!name) {
    return null;
  }

  const safeName = name.replace(/\W+/g, '');
  let controlId = `form${safeName}`;
  if (id) {
    controlId = id;
  }
  let change = (e) => updateStrength(e);
  if (onChange) {
    let key = name;
    if (id) {
      key = id;
    }
    change = (e) => {
      onChange(key, e.target.value);
      updateStrength(e);
    };
  }
  const formControl = (
    <Form.Control
      required
      type="password"
      placeholder={name}
      onChange={change}
      defaultValue={value}
    />
  );
  const formError = (
    <Form.Control.Feedback type="invalid">
      Password must be 6 or more characters.
    </Form.Control.Feedback>
  );
  const formStrength = (
    <div
      ref={ref}
      style={{ height: 10, backgroundColor: '#FF0000', width: 0 }}
    />
  );

  const updateStrength = (e) => {
    let { length } = e.target.value;
    if (length > 32) {
      length = 32;
    }
    const width = (length / 32) * 100;
    let color = '#FF0000';
    if (length < 17 && length >= 6) {
      const i = (length - 2).toString(16);
      color = `#FF${i}${i}00`;
    }
    if (length >= 17) {
      const i = parseInt(32 - length, 10).toString(16);
      color = `#${i}${i}FF00`;
    }
    ref.current.style.width = `${width}%`;
    ref.current.style.backgroundColor = color;
  };

  return (
    <Form.Group as={Col} md={size} controlId={controlId}>
      <FloatingLabel controlId={controlId} label={name}>
        {formControl}
        {formStrength}
        {formError}
      </FloatingLabel>
    </Form.Group>
  );
}

SnnapFormPassword.defaultProps = {
  size: 12,
};

export default SnnapFormPassword;
