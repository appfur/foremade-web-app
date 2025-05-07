import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '/src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SellerProductUpload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sellerName: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    colors: [],
    sizes: [],
    condition: 'New',
    productUrl: '',
    imageUrl: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [customColor, setCustomColor] = useState('');
  const [colorSuggestions, setColorSuggestions] = useState([]);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const categories = [
    'Tablet & Phones',
    'Health & Beauty',
    'Foremade Fashion',
    'Electronics',
    'Baby Products',
    'Computers & Accessories',
    'Game & Fun',
    'Drinks & Categories',
    'Home & Kitchen',
    'Smart Watches',
  ];
  const availableColors = [
    { name: 'Red', hex: '#ff0000' },
    { name: 'Blue', hex: '#0000ff' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#ffff00' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#ffc1cc' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Brown', hex: '#8b4513' },
  ];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const conditions = ['New', 'Used', 'Refurbished'];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          let sellerName = currentUser.displayName || '';
          if (sellerName && sellerName.startsWith('{')) {
            const parsed = JSON.parse(sellerName);
            sellerName = parsed.name || '';
          }
          setFormData((prev) => ({ ...prev, sellerName }));
        } catch (err) {
          console.error('Error parsing displayName:', err);
        }
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

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, imageUrl: '' }));
      setErrors((prev) => ({ ...prev, image: '', imageUrl: '' }));
    } else {
      toast.error('Please select a valid image file.');
    }
  };

  const handleFileInputChange = (e) => {
    handleImageChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-blue-500');
    handleImageChange(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.add('border-blue-500');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current.classList.remove('border-blue-500');
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
    fileInputRef.current.value = '';
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleColorToggle = (color) => {
    setFormData((prev) => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
    setCustomColor('');
    setShowColorDropdown(false);
  };

  const handleColorInputChange = (e) => {
    const value = e.target.value;
    setCustomColor(value);
    if (value.trim() === '') {
      setColorSuggestions([]);
      setShowColorDropdown(false);
      return;
    }
    const filtered = availableColors.filter((color) =>
      color.name.toLowerCase().includes(value.toLowerCase())
    );
    setColorSuggestions(filtered);
    setShowColorDropdown(true);
  };

  const handleCustomColorAdd = (e) => {
    if (e.key === 'Enter' && customColor.trim()) {
      setFormData((prev) => {
        const newColors = prev.colors.includes(customColor.trim())
          ? prev.colors
          : [...prev.colors, customColor.trim()];
        return { ...prev, colors: newColors };
      });
      setCustomColor('');
      setColorSuggestions([]);
      setShowColorDropdown(false);
    }
  };

  const handleRemoveColor = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sellerName.trim()) newErrors.sellerName = 'Please enter your full name.';
    if (!formData.name.trim()) newErrors.name = 'Product name is required.';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = 'Enter a valid price.';
    if (!formData.stock || isNaN(formData.stock) || formData.stock < 0)
      newErrors.stock = 'Enter a valid stock quantity.';
    if (!formData.category) newErrors.category = 'Select a category.';
    if (!image && !formData.imageUrl)
      newErrors.image = 'Select an image or provide an image URL.';
    if (formData.imageUrl && !formData.imageUrl.startsWith('https://'))
      newErrors.imageUrl = 'Image URL must start with https://.';
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
      let finalImageUrl = formData.imageUrl;

      if (image) {
        const uploadData = new FormData();
        uploadData.append('image', image);

        const response = await axios.post('http://localhost:5000/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status !== 200) {
          throw new Error('Failed to upload image to Cloudinary.');
        }

        finalImageUrl = response.data.imageUrl;
        console.log('Cloudinary upload success:', finalImageUrl);
      }

      if (!finalImageUrl || !finalImageUrl.startsWith('https://')) {
        throw new Error('A valid image URL (starting with https://) is required.');
      }

      const productData = {
        sellerName: formData.sellerName,
        name: formData.name,
        description: formData.description || '',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category.toLowerCase(),
        colors: formData.colors,
        sizes: formData.sizes,
        condition: formData.condition || 'New',
        productUrl: formData.productUrl || '',
        imageUrl: finalImageUrl,
        sellerId: user.uid,
        createdAt: new Date().toISOString(),
        reviews: [],
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log('Product saved to Firestore:', { id: docRef.id, ...productData });

      toast.success('Product uploaded successfully!');
      setFormData({
        sellerName: formData.sellerName,
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        colors: [],
        sizes: [],
        condition: 'New',
        productUrl: '',
        imageUrl: '',
      });
      setImage(null);
      setImagePreview('');
      fileInputRef.current.value = '';
      setColorSuggestions([]);
      setShowColorDropdown(false);
      navigate('/my-products');
    } catch (error) {
      console.error('Error uploading product:', {
        message: error.message,
        stack: error.stack,
      });
      toast.error(`Failed to upload product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-blue-50 p-4 sm:p-6 rounded-lg shadow-md flex flex-col gap-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
          Add Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Seller Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`mt-1 w-full py-3 px-3 border rounded-md shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.sellerName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.sellerName && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.sellerName}</p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={`mt-1 w-full py-3 px-3 border rounded-md shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.name}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product"
              className={`mt-1 w-full py-3 px-3 border rounded-md shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              rows="4"
            />
            {errors.description && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                placeholder="Enter price"
                className={`mt-1 w-full py-3 px-3 border rounded-md shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.price
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.price && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className={`mt-1 w-full py-3 px-3 border rounded-md shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.stock
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.stock && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.stock}</p>
              )}
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
              className={`mt-1 block w-full border rounded-md py-3 px-3 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 ${
                errors.category
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Colors</label>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {formData.colors.map((color) => {
                const predefinedColor = availableColors.find(
                  (c) => c.name.toLowerCase() === color.toLowerCase()
                );
                return (
                  <div
                    key={color}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: predefinedColor ? predefinedColor.hex : '#ccc' }}
                    />
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(color)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="bx bx-x"></i>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="relative">
              <input
                type="text"
                value={customColor}
                onChange={handleColorInputChange}
                onKeyDown={handleCustomColorAdd}
                onFocus={() => customColor.trim() && setShowColorDropdown(true)}
                onBlur={() => setTimeout(() => setShowColorDropdown(false), 200)}
                placeholder="Type a color and press Enter"
                className={`w-full py-3 px-3 border rounded-md shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.colors
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {showColorDropdown && colorSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                  {colorSuggestions.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onMouseDown={() => handleColorToggle(color.name)}
                      className="flex items-center w-full p-2 hover:bg-gray-100 text-sm text-gray-800"
                    >
                      <span
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.colors && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.colors}</p>
            )}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Sizes</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-4 py-2 rounded border transition text-xs sm:text-sm ${
                    formData.sizes.includes(size)
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.sizes}</p>
            )}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md py-3 px-3 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 ${
                errors.condition
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Select a condition</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
            {errors.condition && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.condition}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Product URL
              </label>
              <input
                type="url"
                name="productUrl"
                value={formData.productUrl}
                onChange={handleChange}
                placeholder="Enter product URL (optional)"
                className={`mt-1 w-full py-3 px-3 border rounded-md shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.productUrl
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.productUrl && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.productUrl}</p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Product Image or URL <span className="text-red-500">*</span>
              </label>
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`mt-1 w-full p-4 border-2 border-dashed rounded-lg flex items-center justify-center min-h-[200px] transition-colors ${
                  errors.image || errors.imageUrl
                    ? 'border-red-500'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {!imagePreview ? (
                  <div className="text-center">
                    <i className="bx bx-plus text-4xl text-gray-600"></i>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Drag and drop an image here or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="text-blue-600 hover:underline"
                      >
                        browse
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto max-h-[200px] object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <i className="bx bx-x"></i>
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Or enter image URL (e.g., https://...)"
                className={`mt-2 w-full py-3 px-3 border rounded-md shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                  errors.imageUrl
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {(errors.image || errors.imageUrl) && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">
                  {errors.image || errors.imageUrl}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md text-white text-sm sm:text-base font-medium transition duration-200 shadow ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-900 hover:bg-blue-800'
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