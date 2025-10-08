import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, MapPin, List, CheckCircle } from 'lucide-react';
import CartContext from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '', // Renamed 'street' back to 'address' to match the backend model
    city: '',
    state: '',
    postalCode: '', // Renamed 'zipCode' back to 'postalCode' to match the backend model
    country: ''
  });

  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [isAddressFormManual, setIsAddressFormManual] = useState(true);

  useEffect(() => {
    if (user && user.token) {
      const fetchPreviousAddresses = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/orders/myorders`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          
          if (response.data && Array.isArray(response.data)) {
            // Extract unique addresses and store them
            const uniqueAddresses = [...new Map(response.data.map(item => [JSON.stringify(item.shippingAddress), item.shippingAddress])).values()];
            setPreviousAddresses(uniqueAddresses);
          }
        } catch (error) {
          console.error('Error fetching previous addresses:', error);
        }
      };
      fetchPreviousAddresses();
    }
  }, [user, backendUrl]);

  const calculateTotal = () => {
    return cartItems
      .reduce((acc, item) => acc + item.qty * item.price, 0)
      .toFixed(2);
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

  const getImageUrl = (image) => {
    if (image.startsWith('http')) {
      return image;
    }
    const imagePath = image.startsWith('/uploads/') ?
      image.substring('/uploads/'.length) :
      image.startsWith('/') ?
      image.substring(1) :
      image;
    return `${backendUrl}/uploads/${imagePath}`;
  };

  const handleSelectAddress = (address, index) => {
    setShippingAddress(address);
    setSelectedAddressIndex(index);
    setIsAddressFormManual(false);
  };
  
  const handleManualEntry = () => {
    setIsAddressFormManual(true);
    setSelectedAddressIndex(null);
    setShippingAddress({
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    });
  };

  const handleCheckout = async () => {
    if (!user || !user.token) {
      toast.error('You must be logged in to proceed to checkout.');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
        toast.error('Please fill in all shipping details to proceed.');
        return;
    }

    try {
      setLoading(true);
      
      const totalAmount = parseFloat(calculateTotal());

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        totalPrice: totalAmount,
        paymentMethod: 'Order Placed - Payment Disabled', 
        shippingAddress: shippingAddress,
        isPaid: false
      };
      
      const response = await axios.post(
        `${backendUrl}/api/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`, 
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data._id) {
        clearCart();
        toast.success('Order placed successfully! Proceeding to confirmation.');
        navigate(`/payment/${response.data._id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create order. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center">
          <ShoppingBag className="mr-3 text-red-600" />
          Your Shopping Cart
        </h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 bg-white rounded-lg shadow-md p-12">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-4" />
            <p className="text-2xl font-semibold mb-2">Your cart is empty</p>
            <p className="text-lg mb-6">Looks like you haven't added any delicious sweets yet!</p>
            <Link
              to="/products"
              className="inline-flex items-center bg-red-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-red-700 transition duration-300 shadow-lg"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Cart Items */}
            <div className="xl:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  Cart Items ({cartItems.length})
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md mr-4 shadow-sm"
                        onError={(e) => {
                          e.target.src = '/placeholder-sweet.jpg';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 font-medium">₹{item.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center space-x-3 bg-white rounded-lg border px-3 py-2">
                        <button
                          onClick={() => handleDecrement(item)}
                          className="text-gray-600 hover:text-red-600 font-bold text-lg w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="font-semibold text-lg min-w-[2rem] text-center">{item.qty}</span>
                        <button
                          onClick={() => handleIncrement(item)}
                          className="text-gray-600 hover:text-green-600 font-bold text-lg w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="ml-6 text-lg font-bold text-gray-800 min-w-[4rem]">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </p>
                      
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="ml-4 text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <MapPin className="mr-2 text-red-600" /> Shipping Details
                </h2>

                {previousAddresses.length > 0 && (
                    <div className="mb-6">
                        <h3 className="flex items-center font-semibold text-gray-700 mb-3">
                            <List className="w-5 h-5 mr-2" />
                            Use a Previous Address
                        </h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {previousAddresses.map((address, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelectAddress(address, index)}
                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                        selectedAddressIndex === index
                                            ? 'bg-blue-50 border-blue-500 shadow-md'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <p className="font-medium">{address.address}, {address.city}</p>
                                    <p className="text-sm text-gray-600">{address.postalCode}, {address.country}</p>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleManualEntry}
                            className={`mt-4 w-full text-center py-2 text-sm rounded-md transition-colors ${
                                isAddressFormManual
                                    ? 'bg-gray-200 text-gray-800 cursor-default'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Or Enter a New Address
                        </button>
                    </div>
                )}

                {/* Shipping Address Form (manual entry or pre-filled) */}
                <form className="space-y-4 mb-6">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                            required
                            disabled={!isAddressFormManual}
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            id="city"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                            required
                            disabled={!isAddressFormManual}
                        />
                    </div>
                    <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                        <input
                            type="text"
                            id="postalCode"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                            value={shippingAddress.postalCode}
                            onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                            required
                            disabled={!isAddressFormManual}
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                            type="text"
                            id="country"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
                            value={shippingAddress.country}
                            onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                            required
                            disabled={!isAddressFormManual}
                        />
                    </div>
                </form>

                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-t pt-6">
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cartItems.length}):</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery:</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span>Included</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-3 h-5 w-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">
                  <p className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure Checkout
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/products"
                    className="text-red-600 hover:text-red-800 font-medium underline"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;