import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SellerProductDetails() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    sku: '',
    imageFiles: [],
  });
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Toys', 'Other'];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProducts(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProducts = async (sellerId) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs
        .filter((doc) => doc.data().sellerId === sellerId)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products.');
    }
    setLoading(false);
  };

  const validateForm = () => {
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
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required.';
    if (!editingProductId && formData.imageFiles.length === 0) {
      newErrors.imageFiles = 'At least one image is required.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      ['image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024
    );
    if (files.length !== e.target.files.length) {
      toast.error('Only JPEG/PNG images under 5MB are allowed.');
    }
    setFormData((prev) => ({ ...prev, imageFiles: files }));
    setErrors((prev) => ({ ...prev, imageFiles: '' }));
  };

  const uploadImages = async (files, productId) => {
    const imageUrls = [];
    for (const file of files) {
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        sku: formData.sku,
        sellerId: user.uid,
        updatedAt: new Date().toISOString(),
      };

      if (editingProductId) {
        const productRef = doc(db, 'products', editingProductId);
        let imageUrls = products.find((p) => p.id === editingProductId).imageUrls || [];
        if (formData.imageFiles.length > 0) {
          imageUrls = await uploadImages(formData.imageFiles, editingProductId);
        }
        await updateDoc(productRef, { ...productData, imageUrls });
        toast.success('Product updated successfully!');
      } else {
        productData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'products'), productData);
        const imageUrls = await uploadImages(formData.imageFiles, docRef.id);
        await updateDoc(docRef, { imageUrls });
        toast.success('Product added successfully!');
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        sku: '',
        imageFiles: [],
      });
      setEditingProductId(null);
      fetchProducts(user.uid);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product.');
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      sku: product.sku,
      imageFiles: [],
    });
    setEditingProductId(product.id);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, 'products', productId));
        toast.success('Product deleted successfully!');
        fetchProducts(user.uid);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product.');
      }
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterCategory ? product.category === filterCategory : true)
  );

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-blue-50 p-4 sm:p-6 rounded-lg flex flex-col gap-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
          {editingProductId ? 'Edit Product' : 'Add Product'}
        </h2>
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
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                errors.sku ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.sku && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.sku}</p>}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Product Images (JPEG/PNG, max 5MB each) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleFileChange}
              className={`mt-1 w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm ${
                errors.imageFiles ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.imageFiles && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.imageFiles}</p>}
            {formData.imageFiles.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {formData.imageFiles.length} file(s) selected
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded text-white text-sm sm:text-base transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'
            }`}
          >
            {loading ? 'Saving...' : editingProductId ? 'Update Product' : 'Add Product'}
          </button>
          {editingProductId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  price: '',
                  stock: '',
                  category: '',
                  sku: '',
                  imageFiles: [],
                });
                setEditingProductId(null);
              }}
              className="w-full py-3 px-4 rounded bg-gray-500 text-white text-sm sm:text-base hover:bg-gray-600 transition duration-200"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="mt-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Your Products</h3>
          <div className="flex flex-col gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name or SKU"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm border-gray-300 focus:ring-blue-500"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full py-3 px-2 border rounded focus:outline-none focus:ring-2 text-xs sm:text-sm border-gray-300 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p className="text-xs sm:text-sm text-gray-600">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-600">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Stock</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">SKU</th>
                    <th className="p-2 text-left">Images</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">${product.price.toFixed(2)}</td>
                      <td className="p-2">
                        {product.stock} {product.stock === 0 ? '(Out of Stock)' : ''}
                      </td>
                      <td className="p-2">{product.category}</td>
                      <td className="p-2">{product.sku}</td>
                      <td className="p-2">
                        {product.imageUrls?.length > 0 ? (
                          <div className="flex gap-2">
                            {product.imageUrls.slice(0, 2).map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`${product.name} ${index + 1}`}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ))}
                            {product.imageUrls.length > 2 && (
                              <span>+{product.imageUrls.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          'No images'
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:underline mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}