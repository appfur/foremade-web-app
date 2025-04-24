import Carousel from '../components/home/Carousel';
import Category from '../components/home/Category';
import ProductList from '../components/product/ProductList';
import TopStores from '../components/store/TopStore';

const Home = () => {
  return (
    <div>
      <Carousel />
      <Category />
      <TopStores />
      <div className="container mx-auto p-4">
        <h2 className="text-lg font-bold mb-4">Recommended for you</h2>
        <ProductList />
      </div>
    </div>
  );
};

export default Home;