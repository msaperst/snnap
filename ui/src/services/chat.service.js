import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/handle-response';

export const chatService = {
  getConversationList,
  getConversationWith,
};

function getConversationList() {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch('/api/chat/conversation-list', requestOptions).then(
    handleResponse
  );
}

function getConversationWith(user) {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return fetch(`/api/chat/conversation-with/${user}`, requestOptions).then(
    handleResponse
  );
}
