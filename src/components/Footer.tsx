const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 transition">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  