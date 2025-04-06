"use client"; // Correct directive for Next.js client-side component
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import jwtDecode from 'jwt-decode'; // Ensure this is installed and compatible

const SecurityUtils = () => {
  const [inputText, setInputText] = useState('');
  const [secretKey, setSecretKey] = useState('my-secret-key-123');
  const [outputText, setOutputText] = useState('');

  // AES Encryption
  const encryptText = () => {
    try {
      const encrypted = CryptoJS.AES.encrypt(inputText, secretKey).toString();
      setOutputText(encrypted);
    } catch (error) {
      setOutputText('Encryption failed: ' + error.message);
    }
  };

  // AES Decryption
  const decryptText = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(inputText, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      setOutputText(decrypted || 'Invalid ciphertext or key');
    } catch (error) {
      setOutputText('Decryption failed: ' + error.message);
    }
  };

  // JWT Decoding
  const decodeJWT = () => {
    try {
      if (!inputText) {
        setOutputText('Error: No JWT token provided');
        return;
      }
      // Ensure jwtDecode is a function and works correctly
      const decoded = jwtDecode(inputText);
      setOutputText(JSON.stringify(decoded, null, 2));
    } catch (error) {
      setOutputText('Invalid JWT: ' + error.message);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    color: 'black',
    outline: 'none',
    transition: 'border 0.3s ease',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical',
  };

  const sectionStyle = {
    marginBottom: '40px',
    background: '#fafafa',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>🔐 Security & Privacy Utilities</h1>

      <section style={sectionStyle}>
        <h2>Security Tools</h2>

        <div style={{ marginBottom: '15px' }}>
          <label>Secret Key (for AES):</label><br />
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Input (Plain Text, Encrypted Text, or JWT):</label><br />
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={textareaStyle}
            placeholder="Enter text or JWT token here"
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <HoverButton onClick={encryptText} label="Encrypt" />
            <HoverButton onClick={decryptText} label="Decrypt" />
            <HoverButton onClick={decodeJWT} label="Decode JWT" />
          </div>
        </div>

        <div>
          <label>Output:</label><br />
          <pre style={{
            color: 'black',
            background: '#f0f0f0',
            padding: '10px',
            minHeight: '80px',
            whiteSpace: 'pre-wrap',
            borderRadius: '5px',
            fontSize: '13px'
          }}>
            {outputText}
          </pre>
        </div>
      </section>
    </div>
  );
};

// Button with hover animation
const HoverButton = ({ onClick, label }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: '10px',
        padding: '8px 20px',
        fontSize: '14px',
        backgroundColor: hovered ? '#45a049' : '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
      }}
    >
      {label}
    </button>
  );
};

export default SecurityUtils;