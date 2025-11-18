import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './BlogPost.css';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data } = await blogAPI.getById(id);
      setPost(data);
      setComments(data.comments || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load blog post');
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await commentsAPI.create(id, { body: commentBody });
      setComments([data, ...comments]);
      setCommentBody('');
    } catch (err) {
      setError('Failed to post comment');
    }
    setSubmitting(false);
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

  if (error && !post) {
    return (
      <div className="container" style={{ padding: '60px 20px' }}>
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/blog')} className="btn btn-primary">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="blog-post-page">
      <div className="container">
        <button onClick={() => navigate('/blog')} className="back-button">
          ← Back to Blog
        </button>

        <article className="blog-post">
          <header className="post-header">
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span className="post-author">By {post.author?.username || 'Anonymous'}</span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
          </header>

          <div className="post-content">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Comments Section */}
        <section className="comments-section">
          <h2>Comments ({comments.length})</h2>

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Write a comment..."
                className="form-textarea"
                rows="4"
                required
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Please <a href="/login">login</a> to leave a comment.</p>
            </div>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author?.username || 'Anonymous'}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-body">{comment.body}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPost;
