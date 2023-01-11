import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChatDotsFill,
  HandThumbsDown,
  HandThumbsUp,
} from 'react-bootstrap-icons';
import { authenticationService } from '../../services/authentication.service';
import Avatar from '../Avatar/Avatar';
import './UserVisual.css';

function UserVisual(props) {
  const { user, avatarNav } = props;

  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');

  const currentUser = authenticationService.currentUserValue;

  useEffect(() => {
    if (user.rating !== undefined && user.rating !== null) {
      setRating(
        user.rating ? (
          <HandThumbsUp title="Thumbs Up" />
        ) : (
          <HandThumbsDown title="Thumbs Down" />
        )
      );
    }
    if (user && user.username && user.username !== currentUser.username) {
      setMessage(
        <Link
          to="/chat"
          alt={`Chat with ${user.username}`}
          state={{ user: user.username }}
        >
          <ChatDotsFill title={`Chat with ${user.username}`} color="#42a5f5" />
        </Link>
      );
    }
  }, [currentUser, user]);

  return (
    <div className="square">
      <Avatar
        avatar={user.avatar}
        firstname={user.first_name}
        lastname={user.last_name}
        onClick={avatarNav}
      />
      <span className="rating">{rating}</span>
      <span className="message">{message}</span>
    </div>
  );
}

export default UserVisual;
