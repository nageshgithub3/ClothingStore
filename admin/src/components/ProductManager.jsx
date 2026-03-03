import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiInfo } from 'react-icons/fi';
import API from '../api';
import toast from 'react-hot-toast';

// Simple helper inside the component since we don't have the utils shared easily across vite apps without setup
const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const API_URL = 'http://localhost:5000';
    return `${API_URL}${path}`;
};

const ProductManager = ({ products, fetchData }) => {
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', originalPrice: '', category: 'T-Shirts',
        sizes: [], colors: [], stock: '', material: '', isFeatured: false, isNewArrival: false, images: []
    });

    const categories = ['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Accessories', 'Shoes', 'Dresses', 'Men', 'Women', 'Jewelry', 'Bags'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(productForm).forEach(key => {
                if (key === 'sizes' || key === 'colors') {
                    formData.append(key, JSON.stringify(productForm[key]));
                } else if (key === 'imageFiles' && productForm.imageFiles) {
                    Array.from(productForm.imageFiles).forEach(file => formData.append('images', file));
                } else if (key !== 'images' && key !== 'imageFiles') {
                    formData.append(key, productForm[key]);
                }
            });

            if (editProduct && productForm.images) {
                formData.append('existingImages', JSON.stringify(productForm.images));
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editProduct) {
                await API.put(`/products/${editProduct._id}`, formData, config);
                toast.success('Product updated');
            } else {
                await API.post('/products', formData, config);
                toast.success('Product created');
            }
            setShowForm(false);
            setEditProduct(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const openEdit = (product) => {
        setEditProduct(product);
        setProductForm({
            ...product,
            originalPrice: product.originalPrice || '',
            imageFiles: null
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await API.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const toggleSize = (size) => {
        setProductForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
        }));
    };

    return (
        <div className="admin-section animate-fadeIn">
            <div className="admin-section-header">
                <h1>Products ({products.length})</h1>
                <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditProduct(null); setProductForm({ name: '', description: '', price: '', originalPrice: '', category: 'T-Shirts', sizes: [], colors: [], stock: '', material: '', isFeatured: false, isNewArrival: false, images: [] }); }}>
                    <FiPlus /> Add Product
                </button>
            </div>

            {showForm && (
                <div className="admin-form-card animate-fadeIn">
                    <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="admin-form-grid">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input className="form-input" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Category *</label>
                                <select className="form-select" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input className="form-input" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Original Price (₹)</label>
                                <input className="form-input" type="number" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Stock *</label>
                                <input className="form-input" type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required />
                            </div>
                            <div className="form-group full-width">
                                <label>Sizes</label>
                                <div className="size-toggles">
                                    {sizes.map(s => (
                                        <button key={s} type="button" className={`size-toggle ${productForm.sizes.includes(s) ? 'active' : ''}`} onClick={() => toggleSize(s)}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label>Product Images</label>
                                <div className="image-input-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* File Upload Link/Button */}
                                    <div className="file-upload-wrapper">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            id="product-images"
                                            onChange={e => setProductForm({ ...productForm, imageFiles: e.target.files })}
                                            style={{ display: 'none' }}
                                        />
                                        <label
                                            htmlFor="product-images"
                                            className="image-upload-link"
                                            style={{ color: 'var(--color-accent-gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', textDecoration: 'underline' }}
                                        >
                                            <FiUpload /> Click to upload files
                                        </label>
                                    </div>

                                    {/* URL Upload Link */}
                                    <div className="url-upload-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            placeholder="Or paste image URL here..."
                                            className="form-input"
                                            style={{ flex: 1 }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (e.target.value) {
                                                        setProductForm(prev => ({
                                                            ...prev,
                                                            images: [...prev.images, e.target.value]
                                                        }));
                                                        e.target.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>(Press Enter to add)</span>
                                    </div>
                                </div>

                                {productForm.images?.length > 0 && (
                                    <div className="image-previews" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                                        {productForm.images.map((img, i) => (
                                            <div key={i} style={{ position: 'relative', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                                                <img src={img} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                <button
                                                    type="button"
                                                    onClick={() => setProductForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                                                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255, 77, 77, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.8rem' }}>
                                    <FiInfo style={{ marginRight: '4px' }} />
                                    Tip: You can upload local files or add public image links. Cloudinary will host all permanent assets.
                                </p>
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={productForm.isFeatured} onChange={e => setProductForm({ ...productForm, isFeatured: e.target.checked })} />
                                    Featured Product
                                </label>
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={productForm.isNewArrival} onChange={e => setProductForm({ ...productForm, isNewArrival: e.target.checked })} />
                                    New Arrival
                                </label>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-dark" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">{editProduct ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Sold</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {product.images?.[0] ? (
                                            <img src={getImageUrl(product.images[0])} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #333' }} alt="" />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px' }} />
                                        )}
                                        <span style={{ fontWeight: 500 }}>{product.name}</span>
                                    </div>
                                </td>
                                <td>{product.category}</td>
                                <td>₹{product.price}</td>
                                <td>{product.stock}</td>
                                <td>{product.sold}</td>
                                <td>
                                    {product.isFeatured && <span className="badge badge-gold">Featured</span>}
                                    {product.isNewArrival && <span className="badge badge-burgundy">New</span>}
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <button className="table-action-btn" onClick={() => openEdit(product)}><FiEdit2 /></button>
                                        <button className="table-action-btn danger" onClick={() => handleDelete(product._id)}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManager;
