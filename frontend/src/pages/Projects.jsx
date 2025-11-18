import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await projectsAPI.getAll();
      setProjects(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load projects');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="container">
        <div className="page-header">
          <h1>My Projects</h1>
          <p>A collection of my recent work and personal projects</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No projects yet</h3>
            <p>Projects will appear here once they are added.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                {project.imageUrl && (
                  <div className="project-image">
                    <img src={project.imageUrl} alt={project.title} />
                  </div>
                )}
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-links">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
