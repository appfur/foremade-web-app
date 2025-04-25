import { useState, useEffect, useCallback } from 'react';
import db from '../../db.json';

const ProductFilter = ({ onFilterChange = () => {} }) => {
  // Calculate price range based on products
  const minPrice = Math.min(...db.products.map((p) => p.price));
  const maxPrice = Math.max(...db.products.map((p) => p.price));
  const priceRangeMax = Math.ceil(maxPrice / 100) * 100 + 200;

  // State for filters
  const [priceRange, setPriceRange] = useState([minPrice, priceRangeMax]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter categories to display (exclude Deals, Local, Selling)
  const displayCategories = db.categories.filter(
    (category) => !['Deals', 'Local', 'Selling'].includes(category.name)
  );

  // Calculate product count per category
  const categoryCounts = displayCategories.reduce((acc, category) => {
    const count = db.products.filter((product) => product.categoryId === category.id).length;
    return { ...acc, [category.id]: count };
  }, {});

  // Debounce function for search input
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Trigger onFilterChange with current filter state
  const triggerFilterChange = useCallback(() => {
    onFilterChange({
      priceRange,
      selectedCategories,
      sortOption,
      searchTerm,
    });
  }, [priceRange, selectedCategories, sortOption, searchTerm, onFilterChange]);

  // Debounced version for search input
  const debouncedTriggerFilterChange = useCallback(debounce(triggerFilterChange, 300), [triggerFilterChange]);

  // Update parent on every filter change
  useEffect(() => {
    triggerFilterChange();
  }, [priceRange, selectedCategories, sortOption, triggerFilterChange]);

  // Handle search term change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedTriggerFilterChange();
  };

  // Handle price range change
  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    if (index === 0 && newRange[0] > newRange[1]) newRange[0] = newRange[1];
    if (index === 1 && newRange[1] < newRange[0]) newRange[1] = newRange[0];
    setPriceRange(newRange);
  };

  // Handle category checkbox change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceRange([minPrice, priceRangeMax]);
    setSelectedCategories([]);
    setSortOption('default');
    setSearchTerm('');
    triggerFilterChange();
  };

  // Toggle filter dropdown on mobile
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div className="p-2">
      {/* Mobile Filter Dropdown Button */}
      <div className="md:hidden mb-2">
        <button
          onClick={toggleFilter}
          className="w-full bg-blue-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
        >
          <i className="bx bx-filter-alt mr-2"></i>
          Filter & Sort
        </button>
      </div>

      {/* Mobile Filter Dropdown */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden flex items-start justify-center pt-4">
          <div className="bg-white rounded-lg w-11/12 max-h-[90vh] overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Filter & Sort</h2>
              <button onClick={toggleFilter} className="text-gray-600 hover:text-gray-800">
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>
            {/* Search by Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Name</label>
              <input
                type="text"
                placeholder="Enter product name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Price Range Slider */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Min: {priceRange[0]}</span>
                <span className="text-sm text-gray-600">Max: {priceRange[1]}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min={minPrice}
                  max={priceRangeMax}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, e.target.value)}
                  className="w-1/2 accent-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="range"
                  min={minPrice}
                  max={priceRangeMax}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, e.target.value)}
                  className="w-1/2 accent-blue-500"
                />
              </div>
            </div>
            {/* Category Checkboxes */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <div className="space-y-2">
                {displayCategories.map((category) => (
                  <label key={category.id} className="flex items-center justify-between text-sm text-gray-700">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="mr-2 accent-blue-500"
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-gray-500">({categoryCounts[category.id] || 0})</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Sort Options */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="alpha-asc">A-Z</option>
                <option value="alpha-desc">Z-A</option>
              </select>
            </div>
            {/* Clear Filters Button */}
            <button
              onClick={() => { clearFilters(); toggleFilter(); }}
              className="w-full bg-blue-500 text-white text-sm py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Desktop Filter Panel */}
      <div className="hidden md:block p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Search by Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Search by Name</label>
          <input
            type="text"
            placeholder="Enter product name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Price Range Slider */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Min: {priceRange[0]}</span>
            <span className="text-sm text-gray-600">Max: {priceRange[1]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={minPrice}
              max={priceRangeMax}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="w-1/2 accent-blue-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="range"
              min={minPrice}
              max={priceRangeMax}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="w-1/2 accent-blue-500"
            />
          </div>
        </div>
        {/* Category Checkboxes */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <div className="space-y-2">
            {displayCategories.map((category) => (
              <label key={category.id} className="flex items-center justify-between text-sm text-gray-700">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="mr-2 accent-blue-500"
                  />
                  <span>{category.name}</span>
                </div>
                <span className="text-gray-500">({categoryCounts[category.id] || 0})</span>
              </label>
            ))}
          </div>
        </div>
        {/* Sort Options */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="alpha-asc">A-Z</option>
            <option value="alpha-desc">Z-A</option>
          </select>
        </div>
        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="w-full bg-blue-500 text-white text-sm py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;