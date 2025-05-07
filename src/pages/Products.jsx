import { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ProductList from '../components/product/ProductList';
import ProductFilter from '../components/product/ProductFilter';

const Products = () => {
  const [initialProducts, setInitialProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map Firestore category to categoryId for filtering
  const categoryMap = useMemo(
    () => ({
      Electronics: 1,
      Clothing: 2,
      'Home & Garden': 3,
      Books: 4,
      Toys: 5,
      Other: 6,
    }),
    []
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            // Validate required fields
            if (!data.name || !data.price || !data.category) {
              console.warn('Invalid product data:', { id: doc.id, data });
              return null;
            }
            return {
              id: doc.id,
              name: data.name,
              description: data.description || '',
              price: data.price,
              stock: data.stock || 0,
              category: data.category,
              categoryId: categoryMap[data.category] || 6,
              colors: data.colors || [],
              sizes: data.sizes || [],
              condition: data.condition || '',
              imageUrl: data.imageUrl || '',
              sellerId: data.sellerId || '',
              rating: Math.floor(Math.random() * 5) + 1,
            };
          })
          .filter((product) => {
            if (!product) {
              return false;
            }
            const isValidImage = product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.startsWith('https://');
            if (!isValidImage) {
              console.warn('Filtered out product with invalid imageUrl:', {
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
              });
            }
            return isValidImage;
          });

        console.log('Fetched products from Firestore:', products);
        setInitialProducts(products);
        setFilteredProducts(products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryMap]);

  useEffect(() => {
    console.log('Filtered products passed to ProductList:', filteredProducts);
  }, [filteredProducts]);

  const handleFilterChange = useCallback(
    ({ priceRange, selectedCategories, sortOption, searchTerm }) => {
      let updatedProducts = [...initialProducts].filter((product) => product !== null);

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
        updatedProducts.sort((a, b) => b.price - b.price);
      } else if (sortOption === 'alpha-asc') {
        updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOption === 'alpha-desc') {
        updatedProducts.sort((a, b) => b.name.localeCompare(b.name));
      }

      console.log('Updated filtered products:', updatedProducts);
      setFilteredProducts(updatedProducts);
    },
    [initialProducts]
  );

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container rounded-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 m-4">All Products</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full rounded-lg border md:w-1/4">
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full rounded-lg border md:w-3/4">
          <ProductList products={filteredProducts} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Products;