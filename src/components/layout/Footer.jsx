const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Foremade Marketplace. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;