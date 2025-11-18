import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to My <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="hero-subtitle">
              Full-stack developer specializing in modern web technologies.
              Building beautiful, functional, and scalable applications.
            </p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn btn-primary btn-lg">
                View My Work
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Get In Touch
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card">
              <span className="card-emoji">💻</span>
              <span>Full Stack</span>
            </div>
            <div className="floating-card delay-1">
              <span className="card-emoji">🎨</span>
              <span>UI/UX</span>
            </div>
            <div className="floating-card delay-2">
              <span className="card-emoji">🚀</span>
              <span>Performance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <div className="container">
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-icon">⚛️</div>
              <h3>Frontend</h3>
              <p>React, JavaScript, HTML/CSS, Tailwind</p>
            </div>
            <div className="skill-card">
              <div className="skill-icon">🔧</div>
              <h3>Backend</h3>
              <p>Node.js, Express, MongoDB, REST APIs</p>
            </div>
            <div className="skill-card">
              <div className="skill-icon">🛠️</div>
              <h3>Tools</h3>
              <p>Git, VS Code, Postman, Docker</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to work together?</h2>
            <p>Let's create something amazing!</p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Contact Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
