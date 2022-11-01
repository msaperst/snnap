import { Col, Form } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import { userService } from '../../../services/user.service';
import Avatar from '../../Avatar/Avatar';

function EditAvatar(props) {
  const { user } = props;
  const [avatar, setAvatar] = useState(null);

  const avatarUpload = useRef(null);

  useEffect(() => {
    if (user !== undefined) {
      setAvatar(user.avatar);
    }
  }, [user]);

  if (user === undefined) {
    return null;
  }

  const uploadClick = () => {
    avatarUpload.current.click();
  };

  /* istanbul ignore next */
  const uploadFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Dynamically create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Actual resizing
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let { width, height } = img;
        // Change the resizing logic
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Show resized image in preview element
        const dataurl = canvas.toDataURL(imageFile.type);
        setAvatar(dataurl);
        userService.uploadAvatar(dataurl);
        // TODO - set avatar in localstorage
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <Col md={3}>
      <Avatar
        avatar={avatar}
        firstname={user.firstName}
        lastname={user.lastName}
        onClick={uploadClick}
      />
      <Form.Control
        ref={avatarUpload}
        type="file"
        hidden
        onChange={uploadFile}
      />
    </Col>
  );
}

export default EditAvatar;
