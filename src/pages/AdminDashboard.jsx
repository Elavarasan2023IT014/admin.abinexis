import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Save, 
  X,
  Eye,
  Upload,
  Star,
  TrendingUp,
  Package2,
  ShoppingBag,
  CheckCircle,
  Truck,
  AlertCircle,
  Menu,
  ChevronDown
} from 'lucide-react';

// Mock data for demonstration
const mockProducts = [
  {
    _id: '1',
    name: 'Premium Wireless Headphones',
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'TechBrand',
    description: 'High-quality wireless headphones with noise cancellation',
    filters: [
      {
        name: 'color',
        values: ['Black', 'White', 'Blue'],
        priceAdjustments: [
          { value: 'Black', price: 2999, discountPrice: 2599 },
          { value: 'White', price: 2999, discountPrice: 2599 },
          { value: 'Blue', price: 3199, discountPrice: 2799 }
        ]
      }
    ],
    features: ['Noise Cancellation', 'Bluetooth 5.0', '30hr Battery'],
    images: ['https://via.placeholder.com/300x300/52B69A/white?text=Headphones'],
    countInStock: 50,
    rating: 4.5,
    numReviews: 128,
    shippingCost: 99,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Organic Face Cream',
    category: 'Beauty',
    subCategory: 'Skincare',
    brand: 'NaturalGlow',
    description: 'Organic anti-aging face cream with natural ingredients',
    filters: [
      {
        name: 'size',
        values: ['50ml', '100ml'],
        priceAdjustments: [
          { value: '50ml', price: 899, discountPrice: 749 },
          { value: '100ml', price: 1599, discountPrice: 1299 }
        ]
      }
    ],
    features: ['Organic', 'Anti-aging', 'Suitable for all skin types'],
    images: ['https://via.placeholder.com/300x300/76C893/white?text=Face+Cream'],
    countInStock: 75,
    rating: 4.3,
    numReviews: 89,
    shippingCost: 0,
    createdAt: new Date().toISOString()
  }
];

const mockOrders = [
  {
    _id: '1',
    user: { _id: '1', name: 'John Doe' },
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    },
    orderItems: [
      {
        product: '1',
        name: 'Premium Wireless Headphones',
        category: 'Electronics',
        quantity: 1,
        price: 2599,
        originalPrice: 2999,
        image: 'https://via.placeholder.com/100x100/52B69A/white?text=Product'
      }
    ],
    shippingInfo: {
      type: 'Home',
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      phone: '+91 9876543210'
    },
    paymentInfo: {
      method: 'razorpay',
      status: 'completed'
    },
    priceSummary: {
      subtotal: 2599,
      savings: 400,
      shippingCost: 99,
      total: 2698
    },
    orderStatus: 'processing',
    isPaid: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    user: { _id: '2', name: 'Jane Smith' },
    personalInfo: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com'
    },
    orderItems: [
      {
        product: '2',
        name: 'Organic Face Cream',
        category: 'Beauty',
        quantity: 2,
        price: 1299,
        originalPrice: 1599,
        image: 'https://via.placeholder.com/100x100/76C893/white?text=Product'
      }
    ],
    shippingInfo: {
      type: 'Work',
      address: '456 Business Ave',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      phone: '+91 9876543211'
    },
    paymentInfo: {
      method: 'cod',
      status: 'pending'
    },
    priceSummary: {
      subtotal: 2598,
      savings: 600,
      shippingCost: 0,
      total: 2598
    },
    orderStatus: 'shipped',
    isPaid: false,
    createdAt: new Date().toISOString()
  }
];

const mockHomepage = {
  banner: {
    title: 'Welcome to Abinexis',
    image: 'https://via.placeholder.com/1200x400/34A0A4/white?text=Main+Banner'
  },
  featuredProducts: mockProducts.slice(0, 4)
};

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [homepage, setHomepage] = useState(mockHomepage);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Product Management States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    subCategory: '',
    shippingCost: 0,
    countInStock: 0,
    features: [''],
    filters: [{ name: '', values: [''], priceAdjustments: [{ value: '', price: 0, discountPrice: 0 }] }],
    images: ['']
  });

  // Order Management States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Homepage Management States
  const [homepageForm, setHomepageForm] = useState({
    bannerTitle: homepage.banner.title,
    bannerImage: homepage.banner.image
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const categories = [
    'Kitchen', 'Health', 'Fashion', 'Beauty', 'Electronics', 
    'Fitness', 'Spiritual', 'Kids', 'Pets', 'Stationery'
  ];

  const orderStatuses = ['processing', 'shipped', 'out of delivery', 'delivered', 'cancelled'];

  // Sidebar items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'homepage', label: 'Homepage Management', icon: Settings },
    { id: 'products', label: 'Product Management', icon: Package },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
  ];

  // Product Form Handlers
  const handleProductInputChange = (field, value) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...productForm.features];
    newFeatures[index] = value;
    setProductForm(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setProductForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    const newFeatures = productForm.features.filter((_, i) => i !== index);
    setProductForm(prev => ({ ...prev, features: newFeatures }));
  };

  const handleFilterChange = (filterIndex, field, value) => {
    const newFilters = [...productForm.filters];
    newFilters[filterIndex][field] = value;
    setProductForm(prev => ({ ...prev, filters: newFilters }));
  };

  const addFilter = () => {
    setProductForm(prev => ({
      ...prev,
      filters: [...prev.filters, { name: '', values: [''], priceAdjustments: [{ value: '', price: 0, discountPrice: 0 }] }]
    }));
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({ ...product });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        brand: '',
        category: '',
        subCategory: '',
        shippingCost: 0,
        countInStock: 0,
        features: [''],
        filters: [{ name: '', values: [''], priceAdjustments: [{ value: '', price: 0, discountPrice: 0 }] }],
        images: ['']
      });
    }
    setShowProductModal(true);
  };

  const saveProduct = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...productForm, _id: editingProduct._id } : p));
    } else {
      const newProduct = { ...productForm, _id: Date.now().toString(), createdAt: new Date().toISOString(), rating: 0, numReviews: 0 };
      setProducts(prev => [...prev, newProduct]);
    }
    setShowProductModal(false);
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p._id !== productId));
  };

  // Order Management
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order._id === orderId 
        ? { 
            ...order, 
            orderStatus: newStatus,
            isDelivered: newStatus === 'delivered',
            deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : order.deliveredAt
          }
        : order
    ));
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Homepage Management
  const searchProducts = (query) => {
    if (query.trim()) {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addToFeatured = (product) => {
    if (!homepage.featuredProducts.find(p => p._id === product._id)) {
      setHomepage(prev => ({
        ...prev,
        featuredProducts: [...prev.featuredProducts, product]
      }));
    }
  };

  const removeFromFeatured = (productId) => {
    setHomepage(prev => ({
      ...prev,
      featuredProducts: prev.featuredProducts.filter(p => p._id !== productId)
    }));
  };

  const updateBanner = () => {
    setHomepage(prev => ({
      ...prev,
      banner: {
        title: homepageForm.bannerTitle,
        image: homepageForm.bannerImage
      }
    }));
  };

  // Stats calculation
  const stats = {
    totalUsers: 1247,
    totalProducts: products.length,
    totalOrders: orders.length,
    recentProducts: products.slice(-3)
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.orderStatus === status);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Welcome back, Abinash!</h1>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
            <Package2 className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white">₹{orders.reduce((sum, order) => sum + order.priceSummary.total, 0).toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recently Added Products</h2>
        <div className="space-y-4">
          {stats.recentProducts.map(product => (
            <div key={product._id} className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
              <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="text-white font-medium">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.category} • {product.brand}</p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-semibold">In Stock: {product.countInStock}</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-400 text-sm">{product.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHomepage = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Homepage Management</h1>
      
      {/* Banner Management */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Main Banner</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Banner Title</label>
            <input
              type="text"
              value={homepageForm.bannerTitle}
              onChange={(e) => setHomepageForm(prev => ({...prev, bannerTitle: e.target.value}))}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Banner Image URL</label>
            <input
              type="text"
              value={homepageForm.bannerImage}
              onChange={(e) => setHomepageForm(prev => ({...prev, bannerImage: e.target.value}))}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={updateBanner}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Update Banner
          </button>
        </div>
        
        {/* Banner Preview */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white mb-2">Preview</h3>
          <div className="relative rounded-lg overflow-hidden">
            <img src={homepage.banner.image} alt="Banner" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white">{homepage.banner.title}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Featured Products</h2>
        
        {/* Search and Add */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products to add as featured..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchProducts(e.target.value);
                }}
                className="w-full pl-10 p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 bg-gray-900 rounded-lg border border-gray-600 max-h-60 overflow-y-auto">
              {searchResults.map(product => (
                <div key={product._id} className="flex items-center justify-between p-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToFeatured(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Featured Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {homepage.featuredProducts.map(product => (
            <div key={product._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
              <h3 className="text-white font-medium mb-1">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{product.category}</p>
              <button
                onClick={() => removeFromFeatured(product._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Product Management</h1>
        <button
          onClick={() => openProductModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{product.category} • {product.brand}</p>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-green-400 font-semibold">Stock: {product.countInStock}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-400 text-sm">{product.rating} ({product.numReviews})</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => openProductModal(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => handleProductInputChange('name', e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => handleProductInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Brand</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => handleProductInputChange('brand', e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => handleProductInputChange('category', e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Sub Category</label>
                    <input
                      type="text"
                      value={productForm.subCategory}
                      onChange={(e) => handleProductInputChange('subCategory', e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Stock Count</label>
                      <input
                        type="number"
                        value={productForm.countInStock}
                        onChange={(e) => handleProductInputChange('countInStock', parseInt(e.target.value) || 0)}
                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Shipping Cost</label>
                      <input
                        type="number"
                        value={productForm.shippingCost}
                        onChange={(e) => handleProductInputChange('shippingCost', parseInt(e.target.value) || 0)}
                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Product Features</label>
                    {productForm.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder="Enter feature"
                          className="flex-1 p-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addFeature}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      + Add Feature
                    </button>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Product Images (URLs)</label>
                    {productForm.images.map((image, index) => (
                      <input
                        key={index}
                        type="text"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...productForm.images];
                          newImages[index] = e.target.value;
                          handleProductInputChange('images', newImages);
                        }}
                        placeholder="Enter image URL"
                        className="w-full p-2 mb-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Filters Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Product Filters & Pricing</h3>
                {productForm.filters.map((filter, filterIndex) => (
                  <div key={filterIndex} className="bg-gray-900 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Filter Name (e.g., Size, Color)</label>
                        <input
                          type="text"
                          value={filter.name}
                          onChange={(e) => handleFilterChange(filterIndex, 'name', e.target.value)}
                          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-gray-300 text-sm font-medium">Filter Values & Pricing</label>
                      {filter.priceAdjustments.map((adjustment, adjIndex) => (
                        <div key={adjIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={adjustment.value}
                            onChange={(e) => {
                              const newFilters = [...productForm.filters];
                              newFilters[filterIndex].priceAdjustments[adjIndex].value = e.target.value;
                              handleProductInputChange('filters', newFilters);
                            }}
                            placeholder="Value (e.g., S, Red)"
                            className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="number"
                            value={adjustment.price}
                            onChange={(e) => {
                              const newFilters = [...productForm.filters];
                              newFilters[filterIndex].priceAdjustments[adjIndex].price = parseInt(e.target.value) || 0;
                              handleProductInputChange('filters', newFilters);
                            }}
                            placeholder="Original Price"
                            className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="number"
                            value={adjustment.discountPrice}
                            onChange={(e) => {
                              const newFilters = [...productForm.filters];
                              newFilters[filterIndex].priceAdjustments[adjIndex].discountPrice = parseInt(e.target.value) || 0;
                              handleProductInputChange('filters', newFilters);
                            }}
                            placeholder="Discount Price"
                            className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => {
                              const newFilters = [...productForm.filters];
                              newFilters[filterIndex].priceAdjustments.splice(adjIndex, 1);
                              handleProductInputChange('filters', newFilters);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newFilters = [...productForm.filters];
                          newFilters[filterIndex].priceAdjustments.push({ value: '', price: 0, discountPrice: 0 });
                          handleProductInputChange('filters', newFilters);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        + Add Value
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addFilter}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  + Add Filter
                </button>
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => {
    const processingOrders = getOrdersByStatus('processing');
    const shippedOrders = getOrdersByStatus('shipped');
    const deliveredOrders = getOrdersByStatus('delivered');
    const cancelledOrders = getOrdersByStatus('cancelled');

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Order Management</h1>

        {/* Order Status Tabs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { label: 'Processing', count: processingOrders.length, color: 'text-yellow-400' },
                { label: 'Shipped', count: shippedOrders.length, color: 'text-blue-400' },
                { label: 'Delivered', count: deliveredOrders.length, color: 'text-green-400' },
                { label: 'Cancelled', count: cancelledOrders.length, color: 'text-red-400' }
              ].map((tab) => (
                <button
                  key={tab.label}
                  className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-300 hover:text-white hover:border-blue-500 transition-colors"
                >
                  {tab.label} <span className={`ml-2 ${tab.color}`}>({tab.count})</span>
                </button>
              ))}
            </nav>
          </div>

          {/* All Orders */}
          <div className="p-6">
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">Order #{order._id}</h3>
                      <p className="text-gray-400 text-sm">
                        {order.personalInfo.firstName} {order.personalInfo.lastName} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === 'processing' ? 'bg-yellow-900 text-yellow-300' :
                        order.orderStatus === 'shipped' ? 'bg-blue-900 text-blue-300' :
                        order.orderStatus === 'delivered' ? 'bg-green-900 text-green-300' :
                        order.orderStatus === 'cancelled' ? 'bg-red-900 text-red-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                      <button
                        onClick={() => openOrderModal(order)}
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Items</p>
                      <div className="space-y-1">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                            <span className="text-white text-sm">{item.name} x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Payment</p>
                      <p className="text-white text-sm">₹{order.priceSummary.total}</p>
                      <p className={`text-xs ${order.isPaid ? 'text-green-400' : 'text-red-400'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Status Actions</p>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {orderStatuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Detail Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Order Details #{selectedOrder._id}</h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Name:</span> {selectedOrder.personalInfo.firstName} {selectedOrder.personalInfo.lastName}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Email:</span> {selectedOrder.personalInfo.email}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Phone:</span> {selectedOrder.shippingInfo.phone}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
                    <div className="space-y-2">
                      <p className="text-gray-300">{selectedOrder.shippingInfo.address}</p>
                      <p className="text-gray-300">
                        {selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state}
                      </p>
                      <p className="text-gray-300">{selectedOrder.shippingInfo.postalCode}</p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Type:</span> {selectedOrder.shippingInfo.type}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6 bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <p className="text-gray-400 text-sm">{item.category}</p>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">₹{item.price}</p>
                          <p className="text-gray-400 text-sm line-through">₹{item.originalPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="mt-6 bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Payment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.priceSummary.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-green-400">
                      <span>Savings:</span>
                      <span>-₹{selectedOrder.priceSummary.savings}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping:</span>
                      <span>₹{selectedOrder.priceSummary.shippingCost}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2">
                      <div className="flex justify-between text-white font-semibold text-lg">
                        <span>Total:</span>
                        <span>₹{selectedOrder.priceSummary.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Update Order Status</label>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => {
                        updateOrderStatus(selectedOrder._id, e.target.value);
                        setSelectedOrder({...selectedOrder, orderStatus: e.target.value});
                      }}
                      className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {orderStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Order Date</p>
                    <p className="text-white font-medium">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'homepage':
        return renderHomepage();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-gray-800 p-2 rounded-lg border border-gray-700"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Abinexis Admin
            </h1>
            <p className="text-gray-400 text-sm mt-1">Dashboard Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8">
          {renderContent()}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;