import React, { useEffect } from 'react';
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { Col, FloatingLabel, Form } from 'react-bootstrap';

function SnnapFormLocationInput(props) {
  useEffect(() => {
    const input = document.querySelector('.geoapify-autocomplete-input');
    if (input) {
      // reformat the input
      input.className = 'form-control';
      input.setAttribute('required', true);
      // move the input
      const close = input.nextSibling;
      const parent = input.parentNode;
      const grandparent = parent.parentNode;
      let oldChild = parent.removeChild(close);
      grandparent.insertBefore(oldChild, parent);
      oldChild = parent.removeChild(input);
      grandparent.insertBefore(oldChild, parent);
      const formError = document.createElement('div');
      formError.innerHTML = `Please provide a valid ${name.toLowerCase()}.`;
      formError.className = 'invalid-feedback';
      grandparent.insertBefore(formError, parent);
    }
  });

  const { value, size, name, onChange } = props;
  if (!name) {
    return null;
  }
  const safeName = name.replace(/[\W]+/g, '');
  let change = null;
  if (onChange) {
    change = (e) => onChange(name, e);
  }
  const key = 'fa2749a615994e459a223b8cb3832599';

  return (
    <GeoapifyContext apiKey={key}>
      <Form.Group as={Col} md={size} controlId={`form${safeName}`}>
        <FloatingLabel controlId={`form${safeName}`} label={name}>
          <GeoapifyGeocoderAutocomplete
            placeholder={name}
            type="city"
            value={value}
            skipIcons
            placeSelect={change}
          />
        </FloatingLabel>
      </Form.Group>
    </GeoapifyContext>
  );
}

SnnapFormLocationInput.defaultProps = {
  size: 12,
};

export default SnnapFormLocationInput;
