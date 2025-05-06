import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductUpload() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    colors: [],
    sizes: [],
    condition: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Toys', 'Other'];
  const availableColors = [
    { name: 'Red', hex: '#ff0000' },
    { name: 'Blue', hex: '#0000ff' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#ffff00' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
  ];
  const sizes = ['S', 'M', 'L', 'XL'];
  const conditions = ['New', 'Used', 'Refurbished'];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        toast.error('Please log in to add products.');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleColorToggle = (color) => {
    setFormData((prev) => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
    setErrors((prev) => ({ ...prev, colors: '' }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
    setErrors((prev) => ({ ...prev, sizes: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) newErrors.price = 'Enter a valid price.';
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0) newErrors.stock = 'Enter a valid stock quantity.';
    if (!formData.category) newErrors.category = 'Select a category.';
    if (formData.colors.length === 0) newErrors.colors = 'Select at least one color.';
    if (formData.sizes.length === 0) newErrors.sizes = 'Select at least one size.';
    if (!formData.condition) newErrors.condition = 'Select a condition.';
    if (!image) newErrors.image = 'Select an image.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!user) {
      toast.error('You must be logged in to add products.');
      setLoading(false);
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('image', image);
      uploadData.append('name', formData.name);
      uploadData.append('description', formData.description);
      uploadData.append('price', formData.price);
      uploadData.append('stock', formData.stock);
      uploadData.append('category', formData.category);
      uploadData.append('colors', JSON.stringify(formData.colors));
      uploadData.append('sizes', JSON.stringify(formData.sizes));
      uploadData.append('condition', formData.condition);
      uploadData.append('sellerId', user.uid);

      const response = await fetch('/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) throw new Error('Failed to upload product');
      const result = await response.json();
      console.log(result)

      toast.success('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        colors: [],
        sizes: [],
        condition: '',
      });
      setImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error uploading product:', error);
      toast.error(`Failed to upload product: ${error.message}`);
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
                Price (₦) <span className="text-red-500">*</span>
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
              {categories.map((category) => (
                <option key={category} value={category}>
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
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Sizes <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded border ${
                    formData.sizes.includes(size)
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-300 bg-gray-100'
                  } text-xs sm:text-sm`}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.sizes}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md py-3 px-2 text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                errors.condition ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Select a condition</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            {errors.condition && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.condition}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Product Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={`mt-1 w-full py-3 px-2 border rounded text-xs sm:text-sm ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full max-w-xs h-auto rounded"
              />
            )}
            {errors.image && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.image}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded text-white text-sm sm:text-base transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'
            }`}
          >
            {loading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}