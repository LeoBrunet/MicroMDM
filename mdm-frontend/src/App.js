import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [udid, setUdid] = useState('');
  const [requestType, setRequestType] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post('http://localhost:3000/send-command', {
        udid,
        requestType,
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h1>Send MDM Command</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="UDID"
          value={udid}
          onChange={(e) => setUdid(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="Request Type"
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
          Send Command
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          <h2>Response</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
