import React, { useEffect, useState } from 'react';
import { Badge, ListGroup } from 'react-bootstrap';
import { authenticationService } from '../../services/authentication.service';
import './Chat.css';

function Chat(props) {
  const { chatWith, changeChat } = props;

  const [recentConversations, setRecentConversations] = useState([]);

  const user = authenticationService.currentUserValue;

  useEffect(() => {
    let isMounted = true;
    let ws;
    if (user.token) {
      ws = new WebSocket(
        `${process.env.REACT_APP_WS_PROTOCOL}://${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_WS_PORT}/wsapp/conversationList?token=${user.token}`
      );
      ws.onopen = () => {
        // receive messages
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (isMounted) {
            const conversations = addChatToConversation(message);
            if (
              (isMounted &&
                getUnread(conversations) !== getUnread(recentConversations)) ||
              conversations.length !== recentConversations.length
            ) {
              setRecentConversations(conversations);
            }
          }
        };
      };
      return () => {
        ws.close();
      };
    }
    return () => {
      isMounted = false;
    };
  }, [user, chatWith, addChatToConversation, recentConversations]);

  function getUnread(conversations) {
    return conversations.reduce(
      (total, currentValue) => total + currentValue.unread,
      0
    );
  }

  // add new chat user if needed
  function addChatToConversation(message) {
    let conversations = message;
    if (chatWith) {
      if (!message.find((conversation) => conversation.username === chatWith)) {
        conversations = [
          ...message,
          {
            user: 0,
            username: chatWith,
            unread: 0,
          },
        ];
      } else {
        conversations = message.map((conversation) =>
          conversation.username === chatWith
            ? { ...conversation, unread: 0 }
            : conversation
        );
      }
    }
    return conversations;
  }

  return (
    <>
      <h1 className="h3">Conversations</h1>
      <ListGroup defaultActiveKey={`#${chatWith}`} variant="flush">
        {recentConversations.map((conversation) => (
          <ListGroup.Item
            action
            href={`#${conversation.username}`}
            key={conversation.user}
            onClick={() => changeChat(conversation.username)}
            variant="primary"
          >
            {conversation.username}
            {conversation.unread ? (
              <Badge bg="primary" className="float-end" pill>
                {conversation.unread}
              </Badge>
            ) : (
              ''
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {/* <hr />
      <h3>Clients</h3>
      <span className="font-italic">Coming Soon</span>
      <hr />
      <h3>Communities</h3>
      <span className="font-italic">Coming Soon</span> */}
    </>
  );
}

export default Chat;
