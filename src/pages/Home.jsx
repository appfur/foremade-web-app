import Carousel from '../components/home/Carousel';
import Category from '../components/home/Category';
import RecommendedForYou from '../components/product/RecommendedForYou';
// import ProductList from '../components/product/ProductList';
import TopStores from '../components/store/TopStore';

const Home = () => {
  return (
    <div>
      <Carousel />
      <TopStores />
      <Category />
        <RecommendedForYou />
        {/* <ProductList /> */}
    </div>
  );
};

export default Home;