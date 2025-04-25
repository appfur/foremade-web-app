import { useState, useEffect, useMemo } from 'react';
import ProductList from '../components/product/ProductList';
import ProductFilter from '../components/product/ProductFilter';
import db from '../db.json';

const Products = () => {
  // Memoize initialProducts to prevent re-computation on every render
  const initialProducts = useMemo(() => {
    const products = Array.isArray(db.products) ? db.products : [];
    console.log('Initial products from db.json:', products);
    return products;
  }, []); 

  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  // Log filtered products for debugging
  useEffect(() => {
    console.log('Filtered products passed to ProductList:', filteredProducts);
  }, [filteredProducts]);

  // Handle filter changes from ProductFilter
  const handleFilterChange = ({ priceRange, selectedCategories, sortOption, searchTerm }) => {
    let updatedProducts = [...initialProducts];

    // Apply filters
    updatedProducts = updatedProducts.filter((product) => {
      const withinPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      const inSelectedCategories =
        selectedCategories.length === 0 || selectedCategories.includes(product.categoryId);
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return withinPriceRange && inSelectedCategories && matchesSearch;
    });

    // Apply sorting
    if (sortOption === 'price-low-high') {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'alpha-asc') {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'alpha-desc') {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    console.log('Updated filtered products:', updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4">
          <ProductList products={filteredProducts} />
        </div>
      </div>
    </div>
  );
};

export default Products;