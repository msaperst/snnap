import { Col, Form, Image } from 'react-bootstrap';
import React from 'react';
import { userService } from '../../services/user.service';
import './Avatar.css';

function Avatar(props) {
  const { user } = props;

  const avatarUpload = React.useRef(null);

  const uploadClick = () => {
    avatarUpload.current.click();
  };

  const uploadFile = (event) => {
    event.preventDefault();
    event.stopPropagation();
    userService.uploadAvatar(event.target.files[0]).then(() => {});
  };

  let avatar;
  if (user.avatar) {
    avatar = (
      <Image
        roundedCircle
        id="avatar"
        onClick={uploadClick}
        src={`avatars/${user.avatar}`}
      />
    );
  } else {
    let avatarText = '';
    if (user && user.firstName) {
      avatarText = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    avatar = (
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
      {avatar}
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
