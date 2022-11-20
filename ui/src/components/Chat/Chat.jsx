import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authenticationService } from '../../services/authentication.service';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isConnectionOpen, setConnectionOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');

  const { sendTo } = useParams();

  const user = authenticationService.currentUserValue;
  const ws = useRef();

  // sending message function

  const sendMessage = () => {
    if (messageBody) {
      ws.current.send(
        JSON.stringify({
          to: sendTo,
          from: user.username,
          body: messageBody,
        })
      );
      setMessageBody('');
    }
  };

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
      if (data.from === sendTo || data.to === sendTo) {
        setMessages((_messages) => [..._messages, data]);
      }
    };

    return () => {
      ws.current.close();
    };
  }, [sendTo, user.token]);

  const scrollTarget = useRef(null);

  useEffect(() => {
    if (scrollTarget.current) {
      scrollTarget.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center space-y-6">
      <h2 className="text-3xl font-bold">React Ws Chat</h2>
      <div id="chat-view-container" className="flex flex-col w-1/3">
        {messages.map((message, index) => (
          <div
            /* eslint-disable-next-line react/no-array-index-key */
            key={index}
            className={`my-3 rounded py-3 w-1/3 text-white ${
              message.to === user.username
                ? 'self-end bg-purple-600'
                : 'bg-blue-600'
            }`}
          >
            <div className="flex items-center">
              <div className="ml-2">
                <div className="flex flex-row">
                  <div className="text-sm font-medium leading-5 text-gray-900">
                    {message.from} at
                  </div>
                  <div className="ml-1">
                    <div className="text-sm font-bold leading-5 text-gray-900">
                      {new Date(message.sentAt).toLocaleTimeString(undefined, {
                        timeStyle: 'short',
                      })}{' '}
                    </div>
                  </div>
                </div>
                <div className="mt-1 text-sm font-semibold leading-5">
                  {message.body}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollTarget} />
      </div>
      <footer className="w-1/3">
        <p>
          You are chatting with <b>{sendTo}</b>
        </p>

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
    </div>
  );
}

export default ChatPage;
