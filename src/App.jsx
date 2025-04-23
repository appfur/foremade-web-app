import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Foremade Marketplace</h1>
      <ProductForm />
      <ProductList />
    </div>
  );
}

export default App;