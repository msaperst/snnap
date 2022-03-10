import { Col, Form, Image } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import { userService } from '../../../services/user.service';
import './Avatar.css';

function Avatar(props) {
  const { user } = props;
  const [avatar, setAvatar] = useState(null);

  const avatarUpload = useRef(null);

  useEffect(() => {
    console.log('redraw');
    if (user !== undefined) {
      setAvatar(user.avatar);
      console.log(`with: ${user.avatar}`);
    }
  }, [user, avatar]);

  if (user === undefined) {
    return null;
  }

  const uploadClick = () => {
    avatarUpload.current.click();
  };

  const uploadFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const imageFile = event.target.files[0];
    // console.log(imageFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        // Dynamically create a canvas element
        const canvas = document.createElement('canvas');

        // var canvas = document.getElementById("canvas");
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
        userService.uploadAvatar(dataurl).then(setAvatar(dataurl));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };

  let avatarBlock;
  if (avatar) {
    avatarBlock = (
      <Image roundedCircle id="avatar" onClick={uploadClick} src={avatar} />
    );
  } else {
    let avatarText = '';
    if (user && user.firstName) {
      avatarText = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    avatarBlock = (
      <>
        <Image roundedCircle id="avatar" onClick={uploadClick} />
        <span
          id="initials"
          onClick={uploadClick}
          onKeyPress={uploadClick}
          role="button"
          tabIndex="0"
        >
          {avatarText}
        </span>
      </>
    );
  }

  return (
    <Col md={2}>
      {avatarBlock}
      <Form.Control
        ref={avatarUpload}
        type="file"
        hidden
        onChange={uploadFile}
      />
    </Col>
  );
}

export default Avatar;
