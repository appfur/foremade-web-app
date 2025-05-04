import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SellerProductDetails() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    colors: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Toys', 'Other'];
  const availableColors = [
    { name: 'red', hex: '#ff0000' },
    { name: 'blue', hex: '#0000ff' },
    { name: 'green', hex: '#008000' },
    { name: 'yellow', hex: '#ffff00' },
    { name: 'black', hex: '#000000' },
    { name: 'white', hex: '#ffffff' },
  ];

  useEffect(() => {
    console.log('Firestore instance:', db);
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken(true);
          console.log('Authenticated user:', {
            uid: currentUser.uid,
            email: currentUser.email,
            token: token ? 'Present' : 'Missing',
            tokenLength: token?.length || 0,
          });
          setUser(currentUser);
        } catch (error) {
          console.error('Error refreshing token:', error);
          toast.error('Authentication error. Please log in again.');
          setUser(null);
        }
      } else {
        console.warn('No authenticated user. Please log in.');
        toast.error('Please log in to add products.');
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    console.log('Validating form data:', formData);
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Enter a valid price.';
    }
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) {
      newErrors.stock = 'Enter a valid stock quantity.';
    }
    if (!formData.category) newErrors.category = 'Select a category.';
    if (formData.colors.length === 0) newErrors.colors = 'Select at least one color.';
    console.log('Validation errors:', newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleColorToggle = (color) => {
    setFormData((prev) => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
    setErrors((prev) => ({ ...prev, colors: '' }));
    console.log('Toggled color:', color, 'New colors:', formData.colors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Temporarily bypass auth check for testing permissive rules
    // if (!user) {
    //   console.error('No authenticated user.');
    //   toast.error('You must be logged in to add products.');
    //   setLoading(false);
    //   return;
    // }

    try {
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        colors: formData.colors,
        sellerId: user ? user.uid : 'test-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Prepared product data:', productData);

      console.log('Attempting to add product to Firestore...');
      const productsCollection = collection(db, 'products');
      console.log('Collection reference:', productsCollection.path);
      const docRef = await addDoc(productsCollection, productData);
      console.log('Product added successfully, ID:', docRef.id, 'Data:', productData);
      toast.success('Product added successfully!');

      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        colors: [],
      });
    } catch (error) {
      console.error('Error saving product:', {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      toast.error(`Failed to save product: ${error.message || 'Unknown error'}`);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-blue-50 p-4 sm:p-6 rounded-lg flex flex-col gap-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                errors.description ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              rows="4"
            />
            {errors.description && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.description}</p>}
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                  errors.price ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.price && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.price}</p>}
            </div>
            <div className="w-full">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                  errors.stock ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.stock && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md py-3 px-2 text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                errors.category ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Colors <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleColorToggle(color.name)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.colors.includes(color.name)
                      ? 'border-blue-500 opacity-100'
                      : 'border-gray-300 opacity-50'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            {errors.colors && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.colors}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded text-white text-sm sm:text-base transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'
            }`}
          >
            {loading ? 'Saving...' : 'Add Product'}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}