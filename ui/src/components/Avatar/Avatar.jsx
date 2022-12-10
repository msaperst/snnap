/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
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
      <div
        className="circle"
        onClick={onClick}
        onKeyDown={onClick}
        style={{ cursor: 'pointer', backgroundImage: `url(${avatar})` }}
      />
    );
  } else {
    let avatarText = '';
    if (firstname) {
      avatarText = `${firstname.charAt(0)}${lastname.charAt(0)}`;
    }
    avatarBlock = (
      <div
        className="circle initials"
        style={style}
        onClick={onClick}
        onKeyDown={onClick}
      >
        <span onClick={onClick} onKeyDown={onClick} aria-label={avatarText}>
          {avatarText}
        </span>
      </div>
    );
  }

  return avatarBlock;
}

export default Avatar;
