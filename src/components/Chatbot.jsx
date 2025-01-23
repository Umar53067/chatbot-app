import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function Chatbot() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
  ]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const userEmail = localStorage.getItem('email'); 

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      loadChatHistory();
    }
  }, [navigate]);

  // Load chat history from localStorage
  const loadChatHistory = () => {
    const storedChats = JSON.parse(localStorage.getItem('chats') || '[]');
    setChatHistory(storedChats);
  };

  // Save chat to localStorage
  const saveChat = (chatId, messages) => {
    const storedChats = JSON.parse(localStorage.getItem('chats') || '[]');
    const newChat = { id: chatId, messages, email: userEmail };
    storedChats.push(newChat);
    localStorage.setItem('chats', JSON.stringify(storedChats));
    setChatHistory(storedChats);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: newMessages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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', // Replace with actual API key
          },
        }
      );

      const assistantMessage = response.data.choices[0].message;
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Save chat history to localStorage
      saveChat(new Date().toISOString(), updatedMessages);
    } catch (error) {
      console.error('Error fetching response from API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chatId) => {
    const chat = chatHistory.find((chat) => chat.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

  const handleNewChat = () => {
    setMessages([{ role: 'assistant', content: 'Hello! How can I assist you today?' }]);
    setCurrentChatId(null);
  };

  const renderMessage = (message) => {
    return (
      <div
        className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
        key={message.content}
      >
        <div
          className={`inline-block p-2 rounded-lg ${
            message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100 overflow-hidden ">
      {/* Sidebar */}
<div className="w-64 bg-gray-800 text-white p-4 hidden md:block">
  <button
    onClick={handleNewChat}
    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
  >
    New Chat
  </button>
  <div className="overflow-auto h-[calc(100vh-8rem)]">
    <div className="space-y-2">
      {chatHistory.map((chat) => (
        <button
          key={chat.id}
          onClick={() => handleChatClick(chat.id)}
          className={`w-full text-left px-4 py-2 ${
            chat.id === currentChatId ? 'bg-blue-100' : 'hover:bg-gray-100'
          }`}
        >
          {chat.name || 'Untitled Chat'}
        </button>
      ))}
    </div>
  </div>
</div>


      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-auto">
          {messages.map(renderMessage)}
          {loading && (
            <div className="text-left">
              <div className="inline-block p-2 bg-gray-200 text-gray-800 rounded-lg">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
