import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-60 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-xl font-bold text-red-600 mt-4">${product.price.toFixed(2)}</p>
        <button
          className="mt-4 inline-block bg-red-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;