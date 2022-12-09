import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Send } from 'react-bootstrap-icons';
import { authenticationService } from '../../services/authentication.service';
import { chatService } from '../../services/chat.service';
import Message from './Message';
import './Conversation.css';

function Conversation(props) {
  const { chatWith } = props;

  const [messages, setMessages] = useState([]);
  const [isConnectionOpen, setConnectionOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');

  const user = authenticationService.currentUserValue;
  const ws = useRef();

  // sending message function
  const sendMessage = (event) => {
    event.preventDefault();
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
    if (chatWith) {
      ws.current = new WebSocket(
        `${process.env.REACT_APP_WS_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_WS_PORT}/wsapp/?token=${user.token}&user=${chatWith}`
      );

      // Opening the ws connection
      ws.current.onopen = () => {
        setConnectionOpen(true);
      };

      // Listening on ws new added messages
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.from === chatWith || data.to === chatWith) {
          if (
            (data.from === user.username && data.reviewed) ||
            data.from === chatWith
          ) {
            // when sender receives new message, or getting a new message from sender, indicate all old sent as read
            markAllRead();
          }
          setMessages((_messages) => [..._messages, data]);
        }
      };
    }
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [chatWith, user]);

  const markAllRead = () => {
    const els = document.getElementsByClassName('unread');
    Array.from(els).forEach((el) => {
      el.classList.remove('unread');
    });
    chatService.markMessagesRead(chatWith);
  };

  // scroll new messages into view
  const scrollTarget = useRef(null);
  useEffect(() => {
    if (scrollTarget.current) {
      scrollTarget.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // clear out prior messages, and load message history
  useEffect(() => {
    setMessages([]);
    if (chatWith) {
      chatService.getConversationWith(chatWith).then((conversations) => {
        setMessages(conversations);
      });
    }
  }, [chatWith]);

  if (!chatWith) {
    return '';
  }

  return (
    <>
      <h1 className="h2">Chat with {chatWith}</h1>
      <div id="chat-view-container">
        {messages.map((message, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Message key={index} message={message} />
        ))}
        <div ref={scrollTarget} />
      </div>
      <Form id="sendMessageForm" noValidate onSubmit={sendMessage}>
        <Row className="mt-3">
          <Col xs={10}>
            <Form.Group as={Col} controlId="formMessage">
              <Form.Control
                required
                type="text"
                placeholder="Type your message here..."
                onChange={(e) => setMessageBody(e.target.value)}
                value={messageBody}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid message.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={2}>
            <Button
              aria-label="Send"
              onClick={sendMessage}
              style={{ height: '100%', width: '100%' }}
              disabled={!(isConnectionOpen && messageBody)}
              type="button"
            >
              <Send />
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default Conversation;
