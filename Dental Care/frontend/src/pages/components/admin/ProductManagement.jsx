import React, { useEffect, useState } from 'react';
import { getAllProductsApi, deleteProductByIdApi, createProductApi, updateProductByIdApi } from '../../../services/api';
import toast from 'react-hot-toast';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProductsApi();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductByIdApi(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await createProductApi(newProduct);
      toast.success('Product added successfully');
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', price: '', category: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProductByIdApi(editingProduct.id, editingProduct);
      toast.success('Product updated successfully');
      setShowEditModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedProducts = () => {
    if (!sortConfig.key) return products;
    
    return [...products].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getPaginatedProducts = () => {
    const sorted = getSortedProducts();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sorted.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(products.length / pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    fetchProducts();
    toast.success('Products refreshed');
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="pm-header">
        <h1 className="pm-title">Products</h1>
        <button className="btn-refresh" onClick={handleRefresh}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84873 2 11.4829 2.85039 12.5355 4.17157" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 2V4.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh
        </button>
      </div>

      <div className="pm-table-container">
        <div className="pm-table-header">
          Drag a column header here and drop it to group by that column
        </div>
        
        <table className="pm-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>
                Id
                {sortConfig.key === 'id' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
              <th onClick={() => handleSort('name')}>
                Name
                {sortConfig.key === 'name' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
              <th onClick={() => handleSort('description')}>
                Description
                {sortConfig.key === 'description' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
              <th onClick={() => handleSort('category')}>
                Product Category
                {sortConfig.key === 'category' && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedProducts().length > 0 ? (
              getPaginatedProducts().map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditProduct(product)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M10 1.5L12.5 4L4.5 12H2V9.5L10 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5H12M5.5 6V10M8.5 6V10M3 3.5L3.5 12.5H10.5L11 3.5M5.5 3.5V1.5H8.5V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No products found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pm-table-footer">
          <div className="footer-left">
            Total Items: {products.length}
          </div>
          <div className="footer-center">
            <span className="page-size-label">Page Size:</span>
            <select 
              className="page-size-select"
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="footer-right">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="First page"
            >
              ⟨⟨
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              ⟨
            </button>
            <input 
              type="number" 
              className="page-input"
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              min="1"
              max={totalPages}
            />
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              ⟩
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
            >
              ⟩⟩
            </button>
          </div>
        </div>
      </div>

      <div className="pm-add-section">
        <button className="btn-add" onClick={() => setShowAddModal(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  required
                  placeholder="Enter product description"
                />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  required
                  placeholder="Enter product category"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleUpdateProduct}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  required
                  placeholder="Enter product description"
                />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  required
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  required
                  placeholder="Enter product category"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
