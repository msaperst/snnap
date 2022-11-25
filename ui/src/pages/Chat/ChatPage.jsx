import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { chatService } from '../../services/chat.service';
import Conversation from '../../components/Conversation/Conversation';

function ChatPage() {
  const location = useLocation();
  let user = null;
  if (location && location.state) {
    user = location.state.user;
  }
  const [chatWith, setChatWith] = useState(user);
  const [recentConversations, setRecentConversations] = useState([]);

  useEffect(() => {
    chatService.getConversationList().then((conversations) => {
      setRecentConversations(conversations);
    });
  }, []);

  return (
    <Row>
      <Col>
        <h3>Recent Conversations</h3>
        {recentConversations.map((conversation) => (
          <Button
            variant="link"
            key={conversation.user}
            onClick={() => setChatWith(conversation.username)}
          >
            {conversation.username}
          </Button>
        ))}
        <h3>Recent Clients</h3>
        <span className="font-italic">Coming Soon</span>
        <h3>Communities</h3>
        <span className="font-italic">Coming Soon</span>
      </Col>
      <Col>
        <Conversation chatWith={chatWith} />
      </Col>
    </Row>
  );
}

export default ChatPage;
