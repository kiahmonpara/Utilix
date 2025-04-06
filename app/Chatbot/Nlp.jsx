"use client"

import { useState, useRef, useEffect } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import "./Llm.css"

export default function Nlp() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([{ text: "How can I help you today?", isUser: false }])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState(null)
  const [useSpeechInput, setUseSpeechInput] = useState(false)

  const messagesEndRef = useRef(null)
  const widgetRef = useRef(null)

  // Speech Recognition Hook
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Handle click outside to close widget
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleWidget = () => {
    setIsOpen(!isOpen)
  }

  const addMessage = (message, isUser = false) => {
    setMessages((prev) => [...prev, { text: message, isUser }])
  }

  const parseResponse = (responseText) => {
    try {
      const data = typeof responseText === "string" ? JSON.parse(responseText) : responseText;
      return data.answer || data.reply || responseText; // Check for "answer" first, then "reply"
    } catch (err) {
      console.error("Error parsing JSON response:", err);
      return responseText;
    }
  };

  const sendMessage = async () => {
    const message = useSpeechInput ? transcript.trim() : inputMessage.trim();
    if (message === "") return;
  
    addMessage(message, true);
    setInputMessage("");
    resetTranscript();
    setIsLoading(true);
  
    try {
      console.log("Sending request to server with query:", message);
      const response = await fetch("http://10.120.112.230:5000/generate3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });
  
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }
  
      const data = await response.json();
      console.log("Raw server response:", data);
      const parsedResponse = parseResponse(data);
      console.log("Parsed response:", parsedResponse);
      addMessage(parsedResponse);
    } catch (err) {
      addMessage("Sorry, there was an error processing your request. Please try again.", false);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Text-to-Speech Functionality
  const speakText = (text, messageIndex) => {
    window.speechSynthesis.cancel()

    if (speakingMessageId === messageIndex) {
      setSpeakingMessageId(null)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    setSpeakingMessageId(messageIndex)

    utterance.onend = () => {
      setSpeakingMessageId(null)
    }

    window.speechSynthesis.speak(utterance)
  }

  // Toggle Speech Input
  const toggleSpeechInput = () => {
    if (!useSpeechInput) {
      SpeechRecognition.startListening({ continuous: true })
    } else {
      SpeechRecognition.stopListening()
    }
    setUseSpeechInput(!useSpeechInput)
    resetTranscript()
  }

  return (
    <div ref={widgetRef} className={`chat-widget ${isOpen ? "open" : ""}`}>
      {!isOpen ? (
        <button onClick={toggleWidget} className="widget-button" aria-label="Open chat widget">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>
      ) : (
        <>
          <div className="widget-header">
            <h3>Innovatrix</h3>
            <div className="header-buttons">
              <button
                onClick={toggleSpeechInput}
                className={`icon-button ${useSpeechInput ? "active" : ""}`}
                aria-label={useSpeechInput ? "Disable speech input" : "Enable speech input"}
              >
                {useSpeechInput ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                )}
              </button>
              <button onClick={toggleWidget} className="icon-button" aria-label="Minimize chat widget">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 14 10 14 10 20"></polyline>
                  <polyline points="20 10 14 10 14 4"></polyline>
                  <line x1="14" y1="10" x2="21" y2="3"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="icon-button" aria-label="Close chat widget">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.isUser ? "user-message" : "bot-message"}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  {!message.isUser && (
                    <button
                      onClick={() => speakText(message.text, index)}
                      className={`speak-button ${speakingMessageId === index ? "speaking" : ""}`}
                      aria-label={speakingMessageId === index ? "Stop speaking" : "Listen to this message"}
                    >
                      {speakingMessageId === index ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                          <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            {useSpeechInput ? (
              <div className="speech-input">
                <div className={`transcript ${listening ? "listening" : ""}`}>{transcript || "Speak now..."}</div>
                <div className="speech-controls">
                  <div className="control-buttons">
                    {listening ? (
                      <button onClick={SpeechRecognition.stopListening} className="control-button stop">
                        Stop
                      </button>
                    ) : (
                      <button
                        onClick={() => SpeechRecognition.startListening({ continuous: true })}
                        className="control-button start"
                      >
                        Start
                      </button>
                    )}
                    <button onClick={resetTranscript} className="control-button reset">
                      Reset
                    </button>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!transcript.trim() || isLoading}
                    className={`send-button ${!transcript.trim() || isLoading ? "disabled" : ""}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`send-button ${!inputMessage.trim() || isLoading ? "disabled" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

