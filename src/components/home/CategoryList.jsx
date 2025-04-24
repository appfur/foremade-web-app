const CategoryList = () => {
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports'];
  
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
        <div className="flex gap-4 overflow-x-auto">
          {categories.map((category) => (
            <div
              key={category}
              className="bg-gray-200 p-4 rounded min-w-[150px] text-center"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CategoryList;