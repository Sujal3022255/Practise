import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './input.jsx';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setFormData({
        name: response.data.name || '',
        description: response.data.description || '',
        price: response.data.price || '',
        category: response.data.category || '',
        stock: response.data.stock || '',
        image: response.data.image || ''
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put(`/products/${id}`, formData);
      setSuccess('Product updated successfully!');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <div className="edit-product-card">
        <h2>Edit Product</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter product description"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="toothbrush">Toothbrush</option>
              <option value="toothpaste">Toothpaste</option>
              <option value="floss">Floss</option>
              <option value="mouthwash">Mouthwash</option>
              <option value="whitening">Whitening</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Product preview" />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Update Product
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .edit-product-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .edit-product-card {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin-bottom: 1.5rem;
          color: #333;
          font-size: 1.8rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #555;
          font-weight: 500;
        }

        input, textarea, select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #4CAF50;
        }

        textarea {
          resize: vertical;
        }

        .image-preview {
          margin: 1rem 0;
          text-align: center;
        }

        .image-preview img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .btn-cancel, .btn-submit {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn-cancel {
          background-color: #f0f0f0;
          color: #333;
        }

        .btn-cancel:hover {
          background-color: #e0e0e0;
        }

        .btn-submit {
          background-color: #4CAF50;
          color: white;
        }

        .btn-submit:hover {
          background-color: #45a049;
        }

        .error-message {
          background-color: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          border-left: 4px solid #c33;
        }

        .success-message {
          background-color: #efe;
          color: #3c3;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          border-left: 4px solid #3c3;
        }

        .loading-container {
          text-align: center;
          padding: 4rem 1rem;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .edit-product-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default EditProduct;
