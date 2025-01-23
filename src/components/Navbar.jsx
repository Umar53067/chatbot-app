import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Navigate to the login page
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white shadow-lg h-16">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">
            Chatbot Logo
          </Link>
        </div>
        
        {/* Conditional Navigation Links */}
        {localStorage.getItem('token') ? (
          <div className="flex space-x-4"> 
            <button
              onClick={handleLogout}
              className="hover:underline transition duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/signup" className="hover:underline transition duration-200 bg-green-500 p-2 mx-2 rounded-lg">
              Signup
            </Link>
            <Link to="/" className="hover:underline transition duration-200 bg-blue-500 p-2 mx-2 rounded-lg">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
