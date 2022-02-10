import { Col, Form } from 'react-bootstrap';
import React from 'react';
import './SnnapForm.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

function SnnapFormMultiSelect(props) {
  const { size, name, onChange, options } = props;
  if (!name || !options || options.length === 0) {
    return null;
  }
  const safeName = name.replace(/[\W]+/g, '');
  let change = null;
  if (onChange) {
    change = (e) => onChange(name, e);
  }
  const opts = options.map((option) => ({ value: option, label: option }));
  const select = (
    <Select
      options={opts}
      components={animatedComponents}
      placeholder={name}
      isMulti
      onChange={change}
    />
  );

  return (
    <Form.Group as={Col} md={size} controlId={`validation${safeName}`}>
      {select}
    </Form.Group>
  );
}

SnnapFormMultiSelect.defaultProps = {
  size: 12,
};

export default SnnapFormMultiSelect;
