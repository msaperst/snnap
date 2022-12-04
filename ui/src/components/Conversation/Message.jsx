import React from 'react';
import { authenticationService } from '../../services/authentication.service';
import './Message.css';

function Message(props) {
  const { message } = props;

  const user = authenticationService.currentUserValue;

  return (
    <div
      className={`bubble-message ${
        message.to === user.username ? 'them-message' : 'self-message'
      }${message.reviewed ? '' : ' unread'}`}
      data-is={`${
        message.to === user.username ? message.from : 'you'
      } - ${new Date(message.sentAt).toLocaleTimeString(undefined, {
        timeStyle: 'short',
      })}`}
    >
      <span>{message.body}</span>
    </div>
  );
}

export default Message;
