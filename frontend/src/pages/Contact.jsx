import { useState } from 'react';
import { contactAPI } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactAPI.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <h1>Get In Touch</h1>
            <p className="contact-subtitle">
              Have a question or want to work together? Feel free to reach out!
            </p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📧</div>
                <h3>Email</h3>
                <p>contact@example.com</p>
              </div>

              <div className="info-card">
                <div className="info-icon">📍</div>
                <h3>Location</h3>
                <p>Your City, Country</p>
              </div>

              <div className="info-card">
                <div className="info-icon">⏰</div>
                <h3>Response Time</h3>
                <p>Within 24 hours</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              {success && (
                <div className="success-message">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
