import { useState, useEffect } from 'react';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve and parse data from local storage
    const storedData = JSON.parse(localStorage.getItem('users')) || []; // Default to empty array if null

    // Check if any user matches the email and password
    const user = storedData.find(user => user.email === formData.email && user.password === formData.password);

    if (user) {
      setError('');
      // Redirect to the chatbot page or perform any additional actions here

      // Create a session token for the user
      const token = Math.random().toString(36).substring(7); // Generate a random token
      localStorage.setItem('token', token);

      window.location.href = '/chatbot';
    } else {
      setError('Email or Password is incorrect');
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/chatbot';
    }
  }, [])
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Picture */}
        <div className=" hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/chatbot.PNG')` }}>
          {/* Optional: Add overlay or any other styling as desired */}
        </div>
        
        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-black">
          <h2 className="text-2xl font-bold text-center mb-6">Login to Chatbot</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-black"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full   text-white font-bold py-2 rounded-lg bg-blue-500 "
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
