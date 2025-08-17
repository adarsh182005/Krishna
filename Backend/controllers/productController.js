import Product from '../models/productModel.js';
import products from '../data/products.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Import sample products
// @route   POST /api/products/import
// @access  Private/Admin (for temporary use)
const importData = async (req, res) => {
  await Product.deleteMany(); // Deletes all existing products
  const importedProducts = await Product.insertMany(products); // Imports the sample data

  res.status(201).json({ message: 'Data Imported', importedProducts });
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = (req, res) => {
  // Logic to create a new product will go here
  res.send('Create Product route');
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = (req, res) => {
  // Logic to update a product will go here
  res.send('Update Product route');
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = (req, res) => {
  // Logic to delete a product will go here
  res.send('Delete Product route');
};

// Make sure to export all functions at the end of the file
export { getProducts, getProductById, importData, createProduct, updateProduct, deleteProduct };