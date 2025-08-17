import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import UserContext from '../context/UserContext';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (user) {
      navigate('/checkout'); // Redirect to checkout page if logged in
    } else {
      navigate('/login?redirect=/checkout'); // Redirect to login if not
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Your cart is empty.</p>
          <Link to="/products" className="text-gray-800 hover:underline mt-4 inline-block">
            Go back to products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} x {item.qty}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <p className="text-gray-600">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</p>
              <p className="font-semibold">${totalPrice.toFixed(2)}</p>
            </div>
            <hr className="my-4" />
            <button
              onClick={checkoutHandler}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;