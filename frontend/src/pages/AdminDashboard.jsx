import { useState, useEffect } from 'react';
import { projectsAPI, blogAPI, contactAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');

  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    repoUrl: '',
    liveUrl: ''
  });
  const [editingProject, setEditingProject] = useState(null);

  // Blog state
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({
    title: '',
    content: ''
  });
  const [editingPost, setEditingPost] = useState(null);

  // Messages state
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'projects') {
        const { data } = await projectsAPI.getAll();
        setProjects(data);
      } else if (activeTab === 'blog') {
        const { data } = await blogAPI.getAll();
        setPosts(data);
      } else if (activeTab === 'messages') {
        const { data } = await contactAPI.getAll();
        setMessages(data);
      }
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  // Project handlers
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingProject) {
        await projectsAPI.update(editingProject._id, projectForm);
        setSuccess('Project updated successfully!');
      } else {
        await projectsAPI.create(projectForm);
        setSuccess('Project created successfully!');
      }
      resetProjectForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      repoUrl: project.repoUrl || '',
      liveUrl: project.liveUrl || ''
    });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectsAPI.delete(id);
      setSuccess('Project deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      imageUrl: '',
      repoUrl: '',
      liveUrl: ''
    });
    setEditingProject(null);
  };

  // Blog handlers
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingPost) {
        await blogAPI.update(editingPost._id, postForm);
        setSuccess('Post updated successfully!');
      } else {
        await blogAPI.create(postForm);
        setSuccess('Post created successfully!');
      }
      resetPostForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content
    });
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await blogAPI.delete(id);
      setSuccess('Post deleted successfully!');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      content: ''
    });
    setEditingPost(null);
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.username}!</p>
        </div>

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`tab ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => setActiveTab('blog')}
          >
            Blog Posts
          </button>
          <button
            className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages ({messages.length})
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="admin-content">
            <div className="admin-grid">
              <div className="admin-form-section">
                <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <form onSubmit={handleProjectSubmit} className="admin-form">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={projectForm.imageUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Repository URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={projectForm.repoUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Live URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                    </button>
                    {editingProject && (
                      <button type="button" className="btn btn-outline" onClick={resetProjectForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-list-section">
                <h2>Your Projects ({projects.length})</h2>
                <div className="admin-list">
                  {projects.map((project) => (
                    <div key={project._id} className="admin-item">
                      <div className="admin-item-content">
                        <h3>{project.title}</h3>
                        <p>{project.description.substring(0, 100)}...</p>
                      </div>
                      <div className="admin-item-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEditProject(project)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="empty-text">No projects yet. Create your first one!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="admin-content">
            <div className="admin-grid">
              <div className="admin-form-section">
                <h2>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
                <form onSubmit={handlePostSubmit} className="admin-form">
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-textarea"
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      rows="12"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
                    </button>
                    {editingPost && (
                      <button type="button" className="btn btn-outline" onClick={resetPostForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="admin-list-section">
                <h2>Your Blog Posts ({posts.length})</h2>
                <div className="admin-list">
                  {posts.map((post) => (
                    <div key={post._id} className="admin-item">
                      <div className="admin-item-content">
                        <h3>{post.title}</h3>
                        <p>{post.content.substring(0, 100)}...</p>
                        <small>By {post.author?.username}</small>
                      </div>
                      <div className="admin-item-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEditPost(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="empty-text">No blog posts yet. Create your first one!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="admin-content">
            <h2>Contact Messages</h2>
            <div className="messages-list">
              {messages.map((message) => (
                <div key={message._id} className="message-card">
                  <div className="message-header">
                    <strong>{message.name}</strong>
                    <span className="message-email">{message.email}</span>
                    <span className="message-date">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="message-body">{message.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="empty-text">No messages yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
