import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const chatService = {
  getConversationList,
  getConversationWith,
  markMessagesRead,
};

function getConversationList() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch('/api/chat/conversation-list', requestOptions).then(
    handleResponse,
  );
}

function getConversationWith(user) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/chat/conversation-with/${user}`, requestOptions).then(
    handleResponse,
  );
}

function markMessagesRead(user) {
  const headers = authHeader();
  headers['Content-Type'] = 'application/json';
  const requestOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({ user }),
  };

  return fetch(`/api/chat/mark-messages-read`, requestOptions).then(
    handleResponse,
  );
}
