import { Col, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import './SnnapForm.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import './SnnapFormMultiSelect.css';

const animatedComponents = makeAnimated();

function SnnapFormMultiSelect(props) {
  const { size, name, onChange, options, values } = props;
  const [selectedValue, setSelectedValue] = useState([]);

  useEffect(() => {
    // setup our selected values
    if (values) {
      setSelectedValue(values.map((option) => option.value));
    }
  }, [values]);

  // return nothing if we have no options or no name
  if (!name || !options || options.length === 0) {
    return null;
  }

  const safeName = name.replace(/\W+/g, '');
  let change = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  if (onChange) {
    change = (e) => {
      setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
      onChange(name, e);
    };
  }
  const opts = options.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  const select = (
    <Select
      options={opts}
      components={animatedComponents}
      placeholder={name}
      value={opts.filter((obj) => selectedValue.includes(obj.value))}
      isMulti
      className="multi-select-form"
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
