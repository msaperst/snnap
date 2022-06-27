import { Row } from 'react-bootstrap';
import React from 'react';
import SnnapFormInput from '../../../SnnapForms/SnnapFormInput';

function PortfolioItem(props) {
  const { order, link, description, onChange, notRequired } = props;

  return (
    <Row className="mb-3">
      <SnnapFormInput
        id={`${order}:Description`}
        name="Gallery Description"
        type="textarea"
        value={description}
        onChange={onChange}
        notRequired={notRequired}
      />
      <SnnapFormInput
        id={`${order}:Link`}
        name="Gallery Link"
        value={link}
        onChange={onChange}
        notRequired={notRequired}
      />
    </Row>
  );
}

export default PortfolioItem;
