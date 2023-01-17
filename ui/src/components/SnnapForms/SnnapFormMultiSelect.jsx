import { Col, Form } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import './SnnapFormMultiSelect.css';
import './SnnapForm.css';
import Select from 'react-select';

const animatedComponents = makeAnimated();

function SnnapFormMultiSelect(props) {
  const { size, name, onChange, options, values, creatable } = props;

  const [selectedValue, setSelectedValue] = useState([]);
  const [allOptions, setAllOptions] = useState([]);

  useEffect(() => {
    // setup our selected values
    if (values) {
      setSelectedValue(values.map((option) => option.value));
    }
  }, [values]);

  useEffect(() => {
    if (options) {
      const opts = options.map((option) => ({
        value: option.id,
        label: option.name,
      }));
      setAllOptions(opts);
    }
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
      setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
      onChange(name, e);
    };
  }

  const create = (inputValue) => {
    let maxOptionValue = Math.max(...allOptions.map(({ value }) => value));
    maxOptionValue = parseInt(maxOptionValue, 10) + 1;
    setAllOptions([
      ...allOptions,
      { value: maxOptionValue, label: inputValue },
    ]);
    setSelectedValue([...selectedValue, maxOptionValue]);
  };

  let select;
  if (creatable) {
    select = (
      <CreatableSelect
        options={allOptions}
        components={animatedComponents}
        placeholder={name}
        value={allOptions.filter((obj) => selectedValue.includes(obj.value))}
        isMulti
        className="multi-select-form"
        onChange={change}
        onCreateOption={create}
        aria-label={name}
      />
    );
  } else {
    select = (
      <Select
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
  }

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
