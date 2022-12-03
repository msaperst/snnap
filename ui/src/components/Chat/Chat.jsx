import React, { useEffect, useState } from 'react';
import { Badge, ListGroup } from 'react-bootstrap';
import { chatService } from '../../services/chat.service';
import './Chat.css';

function Chat(props) {
  const { chatWith, changeChat } = props;

  const [recentConversations, setRecentConversations] = useState([]);

  useEffect(() => {
    chatService.getConversationList().then((conversations) => {
      let convos;
      if (
        !conversations.find(
          (conversation) => conversation.username === chatWith
        )
      ) {
        convos = [
          ...conversations,
          {
            user: 0,
            username: chatWith,
            unread: 0,
          },
        ];
      } else {
        convos = conversations.map((conversation) =>
          conversation.username === chatWith
            ? { ...conversation, unread: 0 }
            : conversation
        );
      }
      setRecentConversations(convos);
    });
  }, [chatWith]);

  return (
    <>
      <h3>Conversations</h3>
      <ListGroup defaultActiveKey={`#${chatWith}`} variant="flush">
        {recentConversations.map((conversation) => (
          <ListGroup.Item
            action
            href={`#${conversation.username}`}
            key={conversation.user}
            onClick={() => changeChat(conversation.username)}
            variant="primary"
            as="li"
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
      <hr />
      <h3>Clients</h3>
      <span className="font-italic">Coming Soon</span>
      <hr />
      <h3>Communities</h3>
      <span className="font-italic">Coming Soon</span>
    </>
  );
}

export default Chat;
