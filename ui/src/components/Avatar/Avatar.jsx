/* eslint-disable jsx-a11y/control-has-associated-label */
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
        onKeyPress={onClick}
        style={{ backgroundImage: `url(${avatar})` }}
        role="button"
        tabIndex="0"
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
        onClick={onClick}
        onKeyPress={onClick}
        role="button"
        tabIndex="0"
      >
        <span
          onClick={onClick}
          onKeyPress={onClick}
          style={style}
          role="button"
          tabIndex="0"
        >
          {avatarText}
        </span>
      </div>
    );
  }

  return avatarBlock;
}

export default Avatar;
