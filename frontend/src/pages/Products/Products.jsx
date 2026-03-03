import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiGrid, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../../api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const page = parseInt(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search') || '';
    const featured = searchParams.get('featured') || '';
    const newArrivals = searchParams.get('newArrivals') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set('page', page);
                params.set('limit', 12);
                if (category) params.set('category', category);
                if (sort) params.set('sort', sort);
                if (search) params.set('search', search);
                if (featured) params.set('featured', featured);
                if (newArrivals) params.set('newArrivals', newArrivals);

                const { data } = await API.get(`/products?${params.toString()}`);
                setProducts(data.products);
                setTotalPages(data.pages);
                setTotal(data.total);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
        window.scrollTo(0, 0);
    }, [page, category, sort, search, featured, newArrivals]);

    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const goToPage = (p) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', p);
        setSearchParams(newParams);
    };

    const categories = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Accessories', 'Shoes', 'Dresses', 'Men', 'Women', 'Jewelry', 'Bags'];

    const getTitle = () => {
        if (search) return `Search: "${search}"`;
        if (category) return category;
        if (featured) return 'Featured Collection';
        if (newArrivals) return 'New Arrivals';
        return 'All Products';
    };

    return (
        <div className="products-page">
            {/* Page Header */}
            <div className="products-header">
                <div className="container">
                    <h1>{getTitle()}</h1>
                    <p>{total} products found</p>
                </div>
            </div>

            <div className="container">
                <div className="products-layout">
                    {/* Sidebar Filters */}
                    <aside className={`filters-sidebar ${showFilters ? 'active' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            <button className="filters-close" onClick={() => setShowFilters(false)}>
                                <FiX />
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="filter-group">
                            <h4>Category</h4>
                            <div className="filter-options">
                                <button
                                    className={`filter-option ${!category ? 'active' : ''}`}
                                    onClick={() => updateFilter('category', '')}
                                >
                                    All
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`filter-option ${category === cat ? 'active' : ''}`}
                                        onClick={() => updateFilter('category', cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="filter-group">
                            <h4>Sort By</h4>
                            <select
                                className="form-select"
                                value={sort}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        <button className="btn btn-secondary btn-full" onClick={clearFilters}>
                            Clear All Filters
                        </button>
                    </aside>

                    {/* Products */}
                    <div className="products-main">
                        {/* Toolbar */}
                        <div className="products-toolbar">
                            <button className="btn btn-dark btn-sm mobile-filter-btn" onClick={() => setShowFilters(true)}>
                                <FiFilter /> Filters
                            </button>
                            <div className="toolbar-sort">
                                <select
                                    className="form-select"
                                    value={sort}
                                    onChange={(e) => updateFilter('sort', e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="loading-container"><div className="spinner" /></div>
                        ) : products.length === 0 ? (
                            <div className="no-products">
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search terms.</p>
                                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="products-grid">
                                    {products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="pagination-btn"
                                            disabled={page <= 1}
                                            onClick={() => goToPage(page - 1)}
                                        >
                                            <FiChevronLeft />
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                                                onClick={() => goToPage(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            className="pagination-btn"
                                            disabled={page >= totalPages}
                                            onClick={() => goToPage(page + 1)}
                                        >
                                            <FiChevronRight />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
