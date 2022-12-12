import React from 'react';
import { Row } from 'react-bootstrap';
import SnnapFormInput from '../../../SnnapForms/SnnapFormInput';
import SnnapFormTextarea from '../../../SnnapForms/SnnapFormTextarea';

function GalleryItem(props) {
  const { order, link, description, onChange, notRequired } = props;

  return (
    <Row className="mb-3">
      <SnnapFormTextarea
        id={`galleryDescription-${order}`}
        name="Gallery Description"
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
