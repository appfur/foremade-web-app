import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'buyer',
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, formData.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;