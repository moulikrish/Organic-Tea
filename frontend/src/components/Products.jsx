import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { FiShoppingCart } from 'react-icons/fi'

// Products.jsx — Modern animated layout (style B) with Add to Cart
const Products = (props) => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [visibleProducts, setVisibleProducts] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)

  // filters state
  const [sortFilter, setSortFilter] = useState('popularity')
  const [categoryFilter, setCategoryFilter] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [wishlist, setWishlist] = useState({}) // { productId: true }

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/products/fetch-products'),
        axios.get('http://localhost:3000/api/products/fetch-categories')
      ])

      let fetched = Array.isArray(productsResponse.data) ? productsResponse.data : []
      if (props.category && props.category !== 'all') {
        fetched = fetched.filter(p => p.category === props.category)
      }

      setProducts(fetched)
      setVisibleProducts(fetched)
      setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [])

      const maxPrice = fetched.length > 0 ? Math.max(...fetched.map(p => p.price)) : 10000
      setPriceRange([0, maxPrice])
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // --- filtering logic ---
  const handleCategoryToggle = (value) => {
    setCategoryFilter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const handleSortChange = (e) => {
    setSortFilter(e.target.value)
  }

  const handlePriceChange = (e) => {
    const max = parseInt(e.target.value) || 0
    setPriceRange([priceRange[0], max])
  }

  useEffect(() => {
    let filtered = [...products]
    if (categoryFilter.length > 0) filtered = filtered.filter(p => categoryFilter.includes(p.category))
    filtered = filtered.filter(p => p.price >= (priceRange[0] || 0) && p.price <= (priceRange[1] || Infinity))

    switch (sortFilter) {
      case 'low-price': filtered.sort((a,b) => a.price - b.price); break
      case 'high-price': filtered.sort((a,b) => b.price - a.price); break
      case 'discount': filtered.sort((a,b) => (b.discount||0) - (a.discount||0)); break
      case 'rating': filtered.sort((a,b) => (b.rating||0) - (a.rating||0)); break
      default: break
    }

    setVisibleProducts(filtered)
    setCurrentPage(1)
  }, [categoryFilter, priceRange, sortFilter, products])

  // pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = visibleProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage))

  const paginate = (num) => setCurrentPage(num)

  // helpers
  const handleImageError = (e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image' }

  const resolveImage = (p) => {
    if (!p) return 'https://via.placeholder.com/400x400?text=No+Image'
    const candidates = [p.mainImg, p.mainImage, p.image, p.img, p.images && p.images[0], p.imageUrl, p.url].flat().filter(Boolean)
    const src = candidates.find(Boolean)
    if (!src) return 'https://via.placeholder.com/400x400?text=No+Image'
    if (/^(https?:|data:)/i.test(src)) return src
    if (src.startsWith('/')) return `http://localhost:3000${src}`
    return src
  }

  // Add to cart
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token')
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      // backend expected shape may vary — this sends productId and quantity=1
      await axios.post('http://localhost:3000/api/cart/add-to-cart', { productId: product._id, quantity: 1 }, config)
      // small confirmation
      alert(`${product.title} added to cart`)
    } catch (err) {
      console.error('Add to cart failed:', err)
      alert('Failed to add to cart')
    }
  }

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // UI: modern animated cards
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* header + mobile controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{(!props.category || props.category === 'all') ? 'Shop All' : props.category}</h1>
            <p className="text-sm text-gray-600 mt-1">{visibleProducts.length} items</p>
          </div>

          <div className="flex items-center gap-3">
            <select value={sortFilter} onChange={handleSortChange} className="hidden sm:inline-block border rounded px-3 py-2 text-sm">
              <option value="popularity">Featured</option>
              <option value="low-price">Price: Low to High</option>
              <option value="high-price">Price: High to Low</option>
              <option value="discount">Best Discount</option>
              <option value="rating">Top Rated</option>
            </select>

            <button
              onClick={() => setIsFilterOpen(s => !s)}
              className="flex items-center gap-2 px-3 py-2 bg-white border rounded shadow-sm sm:hidden"
            >
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
              <div className="flex flex-col space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`text-left text-sm px-2 py-1 rounded ${categoryFilter.includes(cat) ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Max price</h4>
                <input type="range" min="0" max={Math.max(...products.map(p => p.price), 1000)} value={priceRange[1] || 0} onChange={handlePriceChange} className="w-full" />
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>₹0</span>
                  <span>₹{(priceRange[1]||0).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button onClick={() => { setCategoryFilter([]); setPriceRange([0, Math.max(...products.map(p => p.price), 1000)]) }} className="text-sm text-blue-600">Clear</button>
                <span className="text-xs text-gray-500">{visibleProducts.length} results</span>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({length:12}).map((_,i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse h-80" />
                ))}
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}> 
                  {currentProducts.map(product => {
                    const discountedPrice = product.discount > 0 ? Math.round(product.price - (product.price * product.discount)/100) : product.price

                    return (
                      <article key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                        <div className="relative h-56 bg-gray-50 flex items-center justify-center overflow-hidden">
                          <img src={resolveImage(product)} alt={product.title} onError={handleImageError} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                          {/* wishlist */}
                          <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id) }} className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow-sm hover:scale-105 transition-transform">
                            {wishlist[product._id] ? <AiFillHeart className="text-red-500 w-5 h-5" /> : <AiOutlineHeart className="w-5 h-5 text-gray-600" />}
                          </button>

                          {/* discount */}
                          {product.discount > 0 && (
                            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">{product.discount}%</div>
                          )}

                          {/* rating */}
                          {(product.rating || product.rating === 0) && (
                            <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span>{product.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex flex-col gap-3 h-44">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold">₹{discountedPrice.toLocaleString()}</div>
                              {product.discount > 0 && <div className="text-xs text-gray-500 line-through">₹{product.price.toLocaleString()}</div>}
                            </div>

                            <div className="flex items-center gap-2">
                              <button onClick={(e) => { e.stopPropagation(); addToCart(product) }} className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors">
                                <FiShoppingCart className="w-4 h-4" /> <span className="text-sm font-medium">Add</span>
                              </button>

                              <button onClick={() => navigate(`/product/${product._id}`)} className="text-sm text-gray-600 underline">View</button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {/* pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button onClick={() => paginate(Math.max(1, currentPage-1))} disabled={currentPage===1} className="px-3 py-2 rounded bg-white border">Prev</button>
                    {Array.from({length: totalPages}).map((_,i)=>{
                      const page = i+1
                      if (page===1 || page===totalPages || (page>=currentPage-1 && page<= currentPage+1)) {
                        return (
                          <button key={page} onClick={() => paginate(page)} className={`px-3 py-2 rounded ${currentPage===page? 'bg-green-600 text-white':'bg-white border'}`}>{page}</button>
                        )
                      }
                      if (page===currentPage-2 || page===currentPage+2) return <span key={page} className="px-2">...</span>
                      return null
                    })}
                    <button onClick={() => paginate(Math.min(totalPages, currentPage+1))} disabled={currentPage===totalPages} className="px-3 py-2 rounded bg-white border">Next</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Mobile filter drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="w-80 bg-white p-4 shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-sm text-gray-600">Close</button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`text-left px-2 py-1 rounded ${categoryFilter.includes(cat)? 'bg-green-50 text-green-700':'hover:bg-gray-50'}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Max price</h4>
                <input type="range" min="0" max={Math.max(...products.map(p=>p.price), 1000)} value={priceRange[1]||0} onChange={handlePriceChange} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500 mt-2"><span>₹0</span><span>₹{(priceRange[1]||0).toLocaleString()}</span></div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button onClick={() => { setCategoryFilter([]); setPriceRange([0, Math.max(...products.map(p=>p.price),1000)]) }} className="text-sm text-blue-600">Clear</button>
                <button onClick={() => setIsFilterOpen(false)} className="bg-green-600 text-white px-3 py-2 rounded">Apply</button>
              </div>
            </div>

            <div className="flex-1 bg-black bg-opacity-40" onClick={() => setIsFilterOpen(false)} />
          </div>
        )}

      </div>
    </div>
  )
}

export default Products;