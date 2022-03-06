import { Col, Form, Image } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';
import { userService } from '../../services/user.service';
import './Avatar.css';

function Avatar(props) {
  const { user } = props;
  const [avatar, setAvatar] = useState(null);

  const avatarUpload = useRef(null);

  useEffect(() => {
    setAvatar(user.avatar);
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
    userService.uploadAvatar(event.target.files[0]).then((response) => {
      setAvatar(`${response.file}?${Date.now()}`);
    });
  };

  let avatarBlock;
  if (avatar) {
    avatarBlock = (
      <Image
        roundedCircle
        id="avatar"
        onClick={uploadClick}
        src={`avatars/${user.avatar}?${Date.now()}`}
      />
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
