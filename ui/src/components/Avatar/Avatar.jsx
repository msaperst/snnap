import React from 'react';
import { Image } from 'react-bootstrap';
import './Avatar.css';

function Avatar(props) {
  const { avatar, firstname, lastname, onClick } = props;

  let style;
  if (onClick) {
    style = { cursor: 'pointer' };
  }

  let avatarBlock;
  if (avatar) {
    avatarBlock = (
      <Image
        roundedCircle
        id="avatar"
        onClick={onClick}
        style={style}
        src={avatar}
      />
    );
  } else {
    let avatarText = '';
    if (firstname) {
      avatarText = `${firstname.charAt(0)}${lastname.charAt(0)}`;
    }
    avatarBlock = (
      <>
        <Image roundedCircle id="avatar" onClick={onClick} style={style} />
        <span
          id="initials"
          onClick={onClick}
          onKeyPress={onClick}
          style={style}
          role="button"
          tabIndex="0"
        >
          {avatarText}
        </span>
      </>
    );
  }

  return avatarBlock;
}

export default Avatar;
