import { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import "./Home.css"; // Ensure you link your layout styling sheet!
import Footer from "../components/Footer";

function Home() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const search = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching product data:", err);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="homepage-wrapper">
        {/* Dynamic Title Header Bar */}
        <div className="storefront-header">
          <div>
            <h1>Discover Products</h1>
            <p className="storefront-subtitle">
              Explore our curated selection of premium electronics and gaming setups.
            </p>
          </div>
          <div className="product-results-count">
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "product" : "products"}
          </div>
        </div>

        {/* Dynamic Content Grid Layout */}
        {filteredProducts.length === 0 ? (
          <div className="empty-search-state">
            <div className="empty-icon">🔍</div>
            <h3>No Products Found</h3>
            <p>We couldn't find anything matching "{search}". Try checking your spelling or using different keywords.</p>
          </div>
        ) : (
          <div className="products-grid-layout">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Home;