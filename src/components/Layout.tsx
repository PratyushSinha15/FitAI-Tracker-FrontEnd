import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    
  return (
    <div>
      <Navbar />
      <main className="mt-16 p-4 rounded-xl">{children}</main>
        <Footer />
    </div>
  );
};

export default Layout;
