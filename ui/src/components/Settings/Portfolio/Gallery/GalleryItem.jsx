import { Row } from 'react-bootstrap';
import React from 'react';
import SnnapFormInput from '../../../SnnapForms/SnnapFormInput';

function GalleryItem(props) {
  const { order, link, description, onChange, notRequired } = props;

  return (
    <Row className="mb-3">
      <SnnapFormInput
        id={`galleryDescription-${order}`}
        name="Gallery Description"
        type="textarea"
        value={description}
        onChange={onChange}
        notRequired={notRequired}
      />
      <SnnapFormInput
        id={`galleryLink-${order}`}
        name="Gallery Link"
        value={link}
        onChange={onChange}
        notRequired={notRequired}
      />
    </Row>
  );
}

export default GalleryItem;
