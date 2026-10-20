
import React, { useState, useEffect } from "react";

function Product({ productName, price }) {
  const [currentPrice, setCurrentPrice] = useState(price);

  useEffect(() => {
    console.log("Shopping Cart System Loaded");
  }, []);

  function applyDiscount() {
    setCurrentPrice((previousPrice) =>
      Math.max(0, previousPrice - 200)
    );
  }

  return (
    <div style={{
      border: "2px solid blue",
      padding: "20px",
      margin: "30px",
      borderRadius: "10px"
    }}>
      <h1>Online Shopping Cart</h1>
      <h2>Product Details</h2>
      <p>Product Name: {productName}</p>
      <p>Original Price: ₹{price}</p>
      <p>Current Price: ₹{currentPrice}</p>
      <button onClick={applyDiscount}>
        Apply ₹200 Discount
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Product productName="Laptop" price={1500} />
    </div>
  );
}
