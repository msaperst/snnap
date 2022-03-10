import { Col, Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { userService } from '../../services/user.service';
import './Avatar.css';

function Avatar(props) {
  const { userId } = props;
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.get(userId).then((user) => {
      setUser(user);
    });
  }, [userId]);

  if (userId === undefined) {
    return null;
  }

  let avatarBlock;
  if (user && user.avatar) {
    avatarBlock = <Image roundedCircle id="avatar" src={user.avatar} />;
  } else {
    let avatarText = '';
    if (user && user.first_name) {
      avatarText = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    }
    avatarBlock = (
      <>
        <Image roundedCircle id="avatar" />
        <span id="initials">{avatarText}</span>
      </>
    );
  }

  return <Col md={1}>{avatarBlock}</Col>;
}

export default Avatar;
