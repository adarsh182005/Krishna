import React, { useContext } from 'react';
import CartContext from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  };

  const handleIncrement = (product) => {
    addToCart(product, 1);
  };

  const handleDecrement = (product) => {
    if (product.qty > 1) {
      addToCart(product, -1);
    } else {
      removeFromCart(product._id);
    }
  };

  const handleRemove = (id) => {
    removeFromCart(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-xl">Your cart is empty.</p>
          <Link to="/products" className="mt-4 inline-block bg-gray-800 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-700 transition duration-300">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDecrement(item)} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300">-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => handleIncrement(item)} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300">+</button>
                  </div>
                  <p className="ml-4 text-lg font-semibold text-gray-800">${(item.price * item.qty).toFixed(2)}</p>
                  <button onClick={() => handleRemove(item._id)} className="ml-4 text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
              <div className="flex justify-between text-lg font-medium mb-2">
                <span>Subtotal:</span>
                <span>${calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-lg font-medium mb-4">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-4 border-gray-300">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              <button className="mt-6 w-full bg-red-600 text-white py-3 rounded-full text-lg font-medium hover:bg-red-700 transition duration-300">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;