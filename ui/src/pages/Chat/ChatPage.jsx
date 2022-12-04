import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import Chat from '../../components/Chat/Chat';
import Conversation from '../../components/Conversation/Conversation';

function ChatPage() {
  const location = useLocation();
  let user = null;
  if (location && location.state) {
    user = location.state.user;
  }
  const [chatWith, setChatWith] = useState(user);

  return (
    <Row>
      <Col md={4}>
        <Chat chatWith={chatWith} changeChat={setChatWith} />
      </Col>
      <Col>
        <Conversation chatWith={chatWith} />
      </Col>
    </Row>
  );
}

export default ChatPage;
