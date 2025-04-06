"use client";
import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const fetchWebPreview = async () => {
    let processedUrl = url.trim();
  
    if (!processedUrl) {
      setError('Please enter a URL');
      return;
    }
  
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
      setUrl(processedUrl);
    }
  
    setIsLoading(true);
    setError('');
    setResult(null);
  
    try {
      const response = await fetch('http://localhost:8000/web-preview', { // Ensure this matches your FastAPI endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Extract information from this URL: ${processedUrl}. Include title, main image URL, domain, estimated read time, and keywords.`,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      if (data.error) {
        setError(data.error);
        return;
      }
  
      setResult(data);
    } catch (error) {
      setError('Failed to fetch web preview: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWebPreview();
    }
  };

  return (
    <div style={styles.app}>

      <div style={styles.container}>
        
        <div style={styles.searchBox}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a website URL (e.g., https://example.com)"
              style={styles.input}
            />
            <button
              onClick={fetchWebPreview}
              style={styles.button}
            >
              Preview
            </button>
          </div>
          {error && <div style={styles.errorMessage}>{error}</div>}
        </div>
        
        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Analyzing the webpage...</p>
          </div>
        )}
        
        {result && (
          <div style={styles.resultContainer}>
            
            <div style={styles.resultContent}>
              <h2 style={styles.resultTitle}>{result.title || 'No title found'}</h2>
              
              <div style={styles.metaInfo}>
                <div style={styles.metaBox}>
                  <div style={styles.metaLabel}>Domain</div>
                  <div style={styles.metaValue}>{result.domain || 'Unknown'}</div>
                </div>
                
                <div style={styles.metaBox}>
                  <div style={styles.metaLabel}>Estimated Read Time</div>
                  <div style={styles.metaValue}>{result.estimated_read_time || 'Unknown'}</div>
                </div>
              </div>
              
              <div style={styles.keywordsContainer}>
                <div style={styles.keywordsList}>
                  {result.keywords && result.keywords.length > 0 ? (
                    result.keywords.map((keyword, index) => (
                      <div key={index} style={styles.keyword}>
                        {keyword}
                      </div>
                    ))
                  ) : (
                    <div style={styles.keyword}>No keywords available</div>
                  )}

                </div><br></br>
                <div>{result.description}</div>
                
              </div>
            </div>
          </div>
        )}

        {!isLoading && !result && (
          <div style={styles.ctaContainer}>
            <button style={styles.getStartedButton}>Get Started for Free</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles matching the dark theme from the image
const styles = {
  app: {
    backgroundColor: '#0a0527',
    color: 'white',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  authButtons: {
    display: 'flex',
    gap: '1rem',
  },
  logInButton: {
    padding: '8px 16px',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
  },
  signUpButton: {
    padding: '8px 16px',
    background: '#6c5ce7',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    marginTop: '5rem',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '2rem',
  },
  searchBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
    transition: 'all 0.3s ease',
  },
  inputGroup: {
    display: 'flex',
    marginBottom: '1rem',
  },
  input: {
    flexGrow: 1,
    padding: '12px 15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '5px 0 0 5px',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    transition: 'border 0.3s ease',
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#6c5ce7',
    color: 'white',
    border: 'none',
    borderRadius: '0 5px 5px 0',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#ccc',
    margin: '2rem 0',
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: '#6c5ce7',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
    marginBottom: '1rem',
  },
  resultContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  resultImage: {
    width: '100%',
    height: '300px',
    backgroundColor: '#131035',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  resultContent: {
    padding: '1.5rem',
  },
  resultTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: 'white',
  },
  metaInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '1.5rem',
  },
  metaBox: {
    flex: 1,
    minWidth: '150px',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '15px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  metaLabel: {
    fontSize: '0.9rem',
    color: '#ccc',
    marginBottom: '5px',
  },
  metaValue: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'white',
  },
  keywordsContainer: {
    marginTop: '1.5rem',
  },
  keywordsTitle: {
    fontSize: '1.1rem',
    color: '#ccc',
    marginBottom: '10px',
  },
  keywordsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  keyword: {
    background: 'rgba(108, 92, 231, 0.2)',
    color: '#6c5ce7',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  errorMessage: {
    color: '#ff6b6b',
    padding: '1rem',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '5px',
    marginTop: '1rem',
  },
  ctaContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem',
  },
  getStartedButton: {
    padding: '15px 30px',
    backgroundColor: '#6c5ce7',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default App;