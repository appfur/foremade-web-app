import ProductList from '../components/product/ProductList';
import ProductFilter from '../components/product/ProductFilter';

const Products = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>
      <div className="flex gap-4">
        <div className="w-1/4 hidden md:block">
          <ProductFilter />
        </div>
        <div className="w-full md:w-3/4">
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default Products;