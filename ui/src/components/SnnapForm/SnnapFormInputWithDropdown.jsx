import {
  Col,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
} from 'react-bootstrap';
import React from 'react';
import './SnnapForm.css';

function changeThis(dropDown, option) {
  const button = document.querySelector(`#${dropDown}`);
  button.innerHTML = option.option;
}

function SnnapFormInputWithDropdown(props) {
  const { size, name, onChange, options } = props;
  if (!name || !options || options.length === 0) {
    return null;
  }
  const safeName = name.replace(/[\W]+/g, '');
  let change = null;
  if (onChange) {
    change = (e) => onChange(name, e.target.value);
  }
  const formControl = (
    <Form.Control
      required
      type="text"
      placeholder={name}
      aria-describedby={`inputGroup${safeName}`}
      onChange={change}
    />
  );
  const formError = (
    <Form.Control.Feedback type="invalid">
      Please provide a valid {name.toLowerCase()}.
    </Form.Control.Feedback>
  );

  return (
    <Form.Group as={Col} md={size} controlId={`form${safeName}`}>
      <InputGroup hasValidation>
        {formControl}
        {formError}
        <DropdownButton
          variant="outline-primary"
          title={name}
          id={`dropDown${safeName}`}
          align="end"
        >
          {options.map((option) => (
            <Dropdown.Item
              key={option}
              onClick={() => changeThis(`dropDown${safeName}`, { option })}
            >
              {option}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </InputGroup>
    </Form.Group>
  );
}

SnnapFormInputWithDropdown.defaultProps = {
  size: 12,
};

export default SnnapFormInputWithDropdown;
