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
      input.id = `form${safeName}`;
      input.setAttribute('required', true);
      input.setAttribute('autocomplete', 'off');
      // move the input
      const close = input.nextSibling;
      const parent = input.parentNode;
      const grandparent = parent.parentNode;
      let oldChild = parent.removeChild(close);
      grandparent.insertBefore(oldChild, parent);
      oldChild = parent.removeChild(input);
      grandparent.insertBefore(oldChild, parent);
      const formError = document.createElement('div');
      formError.innerHTML = `Please select a valid ${name.toLowerCase()} from the drop down.`;
      formError.className = 'invalid-feedback';
      grandparent.insertBefore(formError, parent);
    }
  });

  const { value, size, name, onChange } = props;
  if (!name) {
    return null;
  }
  const safeName = name.replace(/\W+/g, '');
  let change = null;
  if (onChange) {
    change = (e) => onChange(name, e);
  }

  return (
    <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
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
