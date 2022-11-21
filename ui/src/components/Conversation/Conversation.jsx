import React, { useEffect, useRef, useState } from 'react';
import { authenticationService } from '../../services/authentication.service';
import Message from './Message';
import './Conversation.css';
import { chatService } from '../../services/chat.service';

function Conversation(props) {
  const { chatWith } = props;

  const [messages, setMessages] = useState([]);
  const [isConnectionOpen, setConnectionOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');

  const user = authenticationService.currentUserValue;
  const ws = useRef();

  // sending message function
  const sendMessage = () => {
    if (messageBody) {
      ws.current.send(
        JSON.stringify({
          to: chatWith,
          from: user.username,
          body: messageBody,
        })
      );
      setMessageBody('');
    }
  };

  // set up the active chat connection
  useEffect(() => {
    ws.current = new WebSocket(
      `${process.env.REACT_APP_WS_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_WS_PORT}/?token=${user.token}`
    );

    // Opening the ws connection
    ws.current.onopen = () => {
      setConnectionOpen(true);
    };

    // Listening on ws new added messages
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.from === chatWith || data.to === chatWith) {
        setMessages((_messages) => [..._messages, data]);
      }
    };
    return () => {
      ws.current.close();
    };
  }, [chatWith, user.token]);

  // scroll new messages into view ?? maybe TODO - will probably get rid of this...
  const scrollTarget = useRef(null);
  useEffect(() => {
    if (scrollTarget.current) {
      scrollTarget.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // clear out prior messages, and load message history
  useEffect(() => {
    setMessages([]);
    // TODO - load history and put it in the array
    chatService.getConversationWith(chatWith).then((conversations) => {
      setMessages(conversations);
    });
  }, [chatWith]);

  if (chatWith === null) {
    return '';
  }

  return (
    <>
      <h2>Chat with {chatWith}</h2>
      <div id="chat-view-container">
        {messages.map((message, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Message key={index} message={message} />
        ))}
        <div ref={scrollTarget} />
      </div>
      <footer className="w-1/3">
        <div className="flex flex-row">
          <input
            id="message"
            type="text"
            className="w-full border-2 border-gray-200 focus:outline-none rounded-md p-2 hover:border-purple-400"
            placeholder="Type your message here..."
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            required
          />
          <button
            aria-label="Send"
            onClick={sendMessage}
            className="m-3"
            disabled={!isConnectionOpen}
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 10L1 1L5 10L1 19L19 10Z"
                stroke="black"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </footer>
    </>
  );
}

export default Conversation;
