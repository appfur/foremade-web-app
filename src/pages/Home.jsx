import Carousel from '../components/home/Carousel';
import CategoryList from '../components/home/CategoryList';
import ProductList from '../components/product/ProductList';

const Home = () => {
  return (
    <div>
      <Carousel />
      <CategoryList />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <ProductList />
      </div>
    </div>
  );
};

export default Home;