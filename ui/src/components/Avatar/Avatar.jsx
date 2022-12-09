/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import './Avatar.css';

function Avatar(props) {
  const { avatar, firstname, lastname, onClick } = props;

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
        aria-label={`${firstname} ${lastname}`}
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
        onKeyDown={onClick}
        role={onClick ? 'button' : null}
        tabIndex={onClick ? '0' : null}
      >
        <span
          onClick={onClick}
          onKeyDown={onClick}
          role={onClick ? 'button' : null}
          tabIndex={onClick ? '0' : null}
        >
          {avatarText}
        </span>
      </div>
    );
  }

  return avatarBlock;
}

export default Avatar;
