import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        setUser({ token });
      } catch (err) {
        localStorage.removeItem('userToken');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
      { email, password }
    );
    localStorage.setItem('userToken', data.token);
    setUser({ token: data.token });
    navigate('/products');
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;