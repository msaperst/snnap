import { Row } from 'react-bootstrap';
import React from 'react';
import SnnapFormInput from '../../../SnnapForms/SnnapFormInput';

function PortfolioItem(props) {
  const { order, link, description, onChange } = props;

  return (
    <Row className="mb-3">
      <SnnapFormInput
        size={11}
        id={`${order}:Description`}
        name="Gallery Description"
        type="textarea"
        value={description}
        onChange={onChange}
      />
      <SnnapFormInput
        id={`${order}:Link`}
        name="Gallery Link"
        value={link}
        onChange={onChange}
      />
    </Row>
  );
}

export default PortfolioItem;
