"use client";
import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const fetchInfo = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please enter a question or prompt.');
      return;
    }
  
    setIsLoading(true);
    setError('');
    setResult(null);
  
    try {
      const response = await fetch('http://localhost:8000/generate2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: trimmed }), // Send the query to the backend
      });
  
      if (!response.ok) throw new Error('Network error.');
  
      const data = await response.json();
  
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data); // Display the result
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchInfo();
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.searchBox}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask something (e.g., What is v0?)"
            style={styles.input}
          />
          <button onClick={fetchInfo} style={styles.button}>
            Ask
          </button>
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Processing...</p>
          </div>
        )}

        {result && (
          <div style={styles.resultBox}>
            <p style={styles.resultDescription}>{result.description}</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.resultLink}
            >
              Learn more →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: {
    backgroundColor: '#0a0527',
    color: 'white',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  searchBox: {
    display: 'flex',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    fontSize: '1rem',
    borderRadius: '5px 0 0 5px',
    border: '1px solid rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'white',
    outline: 'none',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#6c5ce7',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '0 5px 5px 0',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    color: '#ccc',
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.1)',
    borderTop: '4px solid #6c5ce7',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  resultBox: {
    background: 'rgba(255,255,255,0.05)',
    padding: '1.5rem',
    borderRadius: '10px',
  },
  resultDescription: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
  },
  resultLink: {
    color: '#6c5ce7',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  errorMessage: {
    background: 'rgba(255, 107, 107, 0.1)',
    padding: '1rem',
    color: '#ff6b6b',
    borderRadius: '5px',
    marginBottom: '1rem',
  },
};

// Add keyframe animation
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default App;
