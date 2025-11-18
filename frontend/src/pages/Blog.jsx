import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await blogAPI.getAll();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load blog posts');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="container">
        <div className="page-header">
          <h1>Blog</h1>
          <p>Thoughts, tutorials, and insights on web development</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No blog posts yet</h3>
            <p>Check back soon for new content!</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <Link to={`/blog/${post._id}`} key={post._id} className="blog-card">
                <div className="blog-meta">
                  <span className="blog-author">By {post.author?.username || 'Anonymous'}</span>
                  <span className="blog-date">{formatDate(post.createdAt)}</span>
                </div>
                <h2>{post.title}</h2>
                <p className="blog-excerpt">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="read-more">
                  Read More →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
