import { useState, useEffect, useRef } from "react";
import './App.css';
import reactLogo from "./assets/react.svg";
import goLogo from "./assets/go.png";
import exploding from "./assets/exploding.gif";

interface Message {
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Use 'wss' for secure connections when in production
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    socket.current = new WebSocket(`${wsProtocol}://www.golang-react-chatapp.onrender.com/ws`);
  
    // Handle incoming messages
    socket.current.onmessage = (event: MessageEvent) => {
      setMessages((prevMessages) => [...prevMessages, { content: event.data }]);
    };    
  
    // Cleanup on unmount
    return () => {
      socket.current?.close();
    };
  }, []);
  

  const sendMessage = () => {
    if (input && socket.current) {
      socket.current.send(input);
      setInput(""); // Clear input after sending
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior (form submission, etc.)
      sendMessage();
    }
  };

  return (
    <div className="App">
      <div className="images">
        <img src={reactLogo} alt="" />
        <span>+</span> &nbsp; &nbsp;
        <img src={goLogo} alt="" />&nbsp; &nbsp;
        <span>= </span>
        <img src={exploding} alt="" />
      </div>
      <div className="chat-box-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="20"
                height="20"
                viewBox="0 0 256 256"
                xmlSpace="preserve"
                style={{
                  paddingTop: '7.5px',
                }}
              >
                <defs></defs>
                <g
                  style={{
                    stroke: 'none',
                    strokeWidth: '0',
                    strokeDasharray: 'none',
                    strokeLinecap: 'butt',
                    strokeLinejoin: 'miter',
                    strokeMiterlimit: '10',
                    fill: 'none',
                    fillRule: 'nonzero',
                    opacity: '1',
                  }}
                  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                >
                  <path
                    d="M 45 3 c 7.785 0 14.118 6.333 14.118 14.118 v 6.139 c 0 7.785 -6.333 14.118 -14.118 14.118 c -7.785 0 -14.118 -6.333 -14.118 -14.118 v -6.139 C 30.882 9.333 37.215 3 45 3 M 45 0 L 45 0 c -9.415 0 -17.118 7.703 -17.118 17.118 v 6.139 c 0 9.415 7.703 17.118 17.118 17.118 h 0 c 9.415 0 17.118 -7.703 17.118 -17.118 v -6.139 C 62.118 7.703 54.415 0 45 0 L 45 0 z"
                    style={{
                      stroke: 'none',
                      strokeWidth: '1',
                      strokeDasharray: 'none',
                      strokeLinecap: 'butt',
                      strokeLinejoin: 'miter',
                      strokeMiterlimit: '10',
                      fill: 'white',
                      fillRule: 'nonzero',
                      opacity: '1',
                    }}
                    transform="matrix(1 0 0 1 0 0)"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 55.094 45.846 c 11.177 2.112 19.497 12.057 19.497 23.501 V 87 H 15.409 V 69.347 c 0 -11.444 8.32 -21.389 19.497 -23.501 C 38.097 47.335 41.488 48.09 45 48.09 S 51.903 47.335 55.094 45.846 M 54.639 42.727 C 51.743 44.227 48.47 45.09 45 45.09 s -6.743 -0.863 -9.639 -2.363 c -12.942 1.931 -22.952 13.162 -22.952 26.619 v 17.707 c 0 1.621 1.326 2.946 2.946 2.946 h 59.29 c 1.621 0 2.946 -1.326 2.946 -2.946 V 69.347 C 77.591 55.889 67.581 44.659 54.639 42.727 L 54.639 42.727 z"
                    style={{
                      stroke: 'none',
                      strokeWidth: '1',
                      strokeDasharray: 'none',
                      strokeLinecap: 'butt',
                      strokeLinejoin: 'miter',
                      strokeMiterlimit: '10',
                      fill: 'white',
                      fillRule: 'nonzero',
                      opacity: '1',
                    }}
                    transform="matrix(1 0 0 1 0 0)"
                    strokeLinecap="round"
                  />
                </g>
              </svg> &nbsp;
              <div className="texte">{msg.content}</div> {/* Accessing the content property */}
            </div>
          ))}
        </div>
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Add the key down handler here
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
