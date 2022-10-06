import React, { useState, useEffect, useRef } from 'react';
import useWebSocketLite from '../../helpers/useWebSocketLite';

// prettify
const sendTag = (message) => <span>&#11014;: {message}</span>;
const receiveTag = (message) => <span>&#11015;: {message}</span>;

function Test(props) {
  const { currentUser } = props;
  const [messagesList, setMessagesList] = useState([
    <span>Messages will be displayed here</span>,
  ]);
  const txtRef = useRef();

  // use our hook
  const ws = useWebSocketLite({
    socketUrl: `ws://localhost:3001/unreadNotifications?token=${currentUser.token}`,
  });

  // receive messages
  useEffect(() => {
    if (ws.data) {
      const { message } = ws.data;
      setMessagesList((ml) => [].concat(receiveTag(message), ml));
    }
  }, [ws.data]);

  // send messages
  const sendData = () => {
    const message = txtRef.current.value || '';
    if (message) {
      setMessagesList((ml) => [].concat(sendTag(message), ml));
      ws.send(message);
    }
  };

  // a simple form
  return (
    <div>
      <div>Connection State: {ws.readyState ? 'Open' : 'Closed'}</div>

      <div>
        <form>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>Message (string or json)</label>
          <textarea name="message" rows={4} ref={txtRef} />
          <input type="button" onClick={sendData} value="Send" />
        </form>
      </div>

      <div style={{ maxHeight: 300, overflowY: 'scroll' }}>
        {messagesList.map((Tag, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>{Tag}</div>
        ))}
      </div>
    </div>
  );
}

export default Test;
