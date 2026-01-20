import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    field1: '',
    field2: ''
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/endpoint/${id}`);
      setFormData({
        field1: response.data.field1 || '',
        field2: response.data.field2 || ''
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
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
      setLoading(true);
      await api.put(`/endpoint/${id}`, {
        ...formData,
        userId: user?.id
      });
      setSuccess('Updated successfully!');
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2>Edit Form</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="field1">Field 1</label>
            <input
              type="text"
              id="field1"
              name="field1"
              value={formData.field1}
              onChange={handleChange}
              required
              placeholder="Enter first field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="field2">Field 2</label>
            <input
              type="text"
              id="field2"
              name="field2"
              value={formData.field2}
              onChange={handleChange}
              required
              placeholder="Enter second field"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .edit-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .edit-card {
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

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #555;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        input:focus {
          outline: none;
          border-color: #4CAF50;
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

        .btn-cancel:hover:not(:disabled) {
          background-color: #e0e0e0;
        }

        .btn-submit {
          background-color: #4CAF50;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #45a049;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        @media (max-width: 768px) {
          .edit-card {
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-cancel, .btn-submit {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Edit;
