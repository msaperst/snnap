// useWebSocketLite.js
import { useState, useEffect } from 'react';

// define a custom hook
// accept the url to connect to
// number of times the hook should retry a connection
// the interval between retries
function useWebSocketLite({
  socketUrl,
  retry: defaultRetry = 9999999999,
  retryInterval = 1500,
}) {
  // message and timestamp
  const [data, setData] = useState();
  // send function
  const [send, setSend] = useState(() => () => undefined);
  // state of our connection
  const [retry, setRetry] = useState(defaultRetry);
  // retry counter
  const [readyState, setReadyState] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(socketUrl);
    ws.onopen = () => {
      setReadyState(true);

      // function to send messages
      setSend(() => (da) => {
        try {
          const d = JSON.stringify(da);
          ws.send(d);
          return true;
        } catch (err) {
          return false;
        }
      });

      // receive messages
      ws.onmessage = (event) => {
        const msg = formatMessage(event.data);
        setData({ message: msg, timestamp: getTimestamp() });
      };
    };

    // on close we should update connection state
    // and retry connection
    ws.onclose = () => {
      setReadyState(false);
      // retry logic
      if (retry > 0) {
        setTimeout(() => {
          setRetry((r) => r - 1);
        }, retryInterval);
      }
    };
    // terminate connection on unmount
    return () => {
      ws.close();
    };
    // retry dependency here triggers the connection attempt
  }, [retry]);

  return { send, data, readyState };
}

// small utilities that we need
// handle json messages
function formatMessage(data) {
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
}

// get epoch timestamp
function getTimestamp() {
  return new Date().getTime();
}

export default useWebSocketLite;
