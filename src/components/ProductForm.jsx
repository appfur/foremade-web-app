import { useState } from 'react';
import api from '../api';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('image', formData.image);

    try {
      const response = await api.post('/api.php', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Product added:', response.data);
      setFormData({ name: '', description: '', price: '', image: null });
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || 'Error adding product');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto"
    >
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        className="border p-2 rounded w-full"
      />
      <input
        type="file"
        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;