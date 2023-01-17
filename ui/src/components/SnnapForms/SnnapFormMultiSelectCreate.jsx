import { Col, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import './SnnapForm.css';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

import './SnnapFormMultiSelect.css';

const animatedComponents = makeAnimated();

function SnnapFormMultiSelectCreate(props) {
  const { size, name, onChange, options, values } = props;

  const [selectedValue, setSelectedValue] = useState([]);
  const [allOptions, setAllOptions] = useState([]);

  useEffect(() => {
    // setup our selected values
    if (values) {
      setSelectedValue(values.map((option) => option.value));
    }
  }, [values]);

  useEffect(() => {
    const opts = options.map((option) => ({
      value: option.id,
      label: option.name,
    }));
    setAllOptions(opts);
  }, [options]);

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
      console.log(e);
      const newLabel = e.filter((obj) => {
        if (obj.__isNew__) {
          return obj.label;
        }
        return null;
      });
      const maxOptionValue = allOptions.reduce((p, c) =>
        p.value > c.value ? p : c
      );
      console.log(maxOptionValue);
      setAllOptions([
        ...allOptions,
        { value: maxOptionValue + 1, label: newLabel },
      ]);
      // TODO - need to add the new value to selected options - otherwise it's not getting picked up
      setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
      onChange(name, e);
    };
  }

  const select = (
    <CreatableSelect
      options={allOptions}
      components={animatedComponents}
      placeholder={name}
      value={allOptions.filter((obj) => selectedValue.includes(obj.value))}
      isMulti
      className="multi-select-form"
      onChange={change}
      aria-label={name}
    />
  );

  return (
    <Form.Group as={Col} md={size} controlId={`validation${safeName}`}>
      {select}
    </Form.Group>
  );
}

SnnapFormMultiSelectCreate.defaultProps = {
  size: 12,
};

export default SnnapFormMultiSelectCreate;
