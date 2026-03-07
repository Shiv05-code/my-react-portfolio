import './App.css';
import Me from './Me.jpg';
import MyResume from "./MyResume.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faDownload, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ReactTyped } from 'react-typed';
import { useEffect, useRef, useState, useMemo } from 'react';

function Reveal({ children, className = "", ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el); // animate once
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`reveal ${className}`} {...props}>
      {children}
    </section>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem("theme");

  if (saved) {
    return saved === "dark";
  }

  // No saved preference → use system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
});
  const sections = useMemo(() => ["about", "experience", "socials", "resume"], []);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
  const theme = darkMode ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}, [darkMode]);

  useEffect(() => {
  const navOffset = 95; // your sticky header height (85) + a little cushion

  const onScroll = () => {
    const pos = window.scrollY + navOffset;

    // last section whose top is above pos
    let current = sections[0];

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;

      if (el.offsetTop <= pos) current = id;
    }

    setActiveSection(current);
  };

  onScroll(); // set initial
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, [sections]);

  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = MyResume;
    link.download = 'Shivansh_Kanda_Resume.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <header className="header">
        <nav className="navbar">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(prev => !prev)}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <ul className="navbar-list">
            <li>
              <a href="#about" className={activeSection === "about" ? "nav-active" : ""}>About</a>
            </li>
            <li>
              <a href="#experience" className={activeSection === "experience" ? "nav-active" : ""}>Experience</a>
            </li>
            <li>
              <a href="#socials" className={activeSection === "socials" ? "nav-active" : ""}>Socials</a>
            </li>
            <li>
              <a href="#resume" className={activeSection === "resume" ? "nav-active" : ""}>Resume</a>
            </li>
          </ul>
        </nav>
      </header>

      <Reveal id="about">
        <h3>Hello, I'm</h3>
        <h1 className="typing-container">
          <ReactTyped
            strings={["Shivansh Kanda"]}
            typeSpeed={100}
            showCursor={true}
            cursorChar="|"
          />
        </h1>

        <div className="Me">
          <img src={Me} alt="Description" width="300" />
          <div className="Info">
            <p>
              I'm a Junior at Cal State University of Long Beach
              working towards my Bachelor's Degree in Computer Science. I'm passionate about technology and
              intrigued by the way it shapes our world. I enjoy tackling challenging problems
              to discover creative solutions. In my free time, you'll see me hitting the gym, playing my flute,
              or being one with nature.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal id="experience">
        <h1>Experience</h1>
        <div className="experience-cards">
          <div className={`flip-card ${flippedCards['card1'] ? 'flipped' : ''}`} onClick={() => toggleFlip('card1')}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h1>Junior Achievement Intern</h1>
                <p className="click-hint">Click here to see more</p>
              </div>
              <div className="flip-card-back">
                <h2>Jul. 2025 - Present</h2>
                <p><b>~</b> Collaborated on targeted email campaigns to secure corporate funding for children’s financial literacy programs.</p>
                <p><b>~</b> Supported a Vans campaign funding student career readiness, financial literacy, and business development initiatives.</p>
                <p><b>~</b> Trained team members to leverage social media for broader reach and engagement.</p>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className={`flip-card ${flippedCards['card2'] ? 'flipped' : ''}`} onClick={() => toggleFlip('card2')}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h1>Optimus Learning School</h1>
                <p className="click-hint">Click here to see more</p>
              </div>
              <div className="flip-card-back">
                <h2>Jul. 2024 - Jan. 2025</h2>
                <p><b>~</b> Instructed K–6 students in summer and after-school programs, supporting learning strategies, discipline, and character development.</p>
                <p><b>~</b> Designed and delivered engaging, age-appropriate lessons for groups of up to 20 students.</p>
                <p><b>~</b> Provided individualized support to select students, leading to measurable academic improvement.</p>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className={`flip-card ${flippedCards['card3'] ? 'flipped' : ''}`} onClick={() => toggleFlip('card3')}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h1>Best Buy</h1>
                <p className="click-hint">Click here to see more</p>
              </div>
              <div className="flip-card-back">
                <h2>Oct. 2023 - Jan. 2024</h2>
                <p><b>~</b> Managed inventory for 200+ SKUs, conducting regular audits to maintain 90% accuracy.</p>
                <p><b>~</b> Assisted an average of 50 customers weekly by providing product guidance and support.</p>
                <p><b>~</b> Helped execute timely promotional displays, contributing to increased sales during campaigns.</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal id="socials">
        <h1>Socials</h1>
        <div className="icon-container">
          <div className="social-icon">
            <a href="https://www.linkedin.com/in/shivansh-kanda-08a443294/" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} size="3x" className="icon" />
            </a>
          </div>
          <div className="social-icon">
            <a href="mailto:shivanshkanda@gmail.com">
              <FontAwesomeIcon icon={faEnvelope} size="3x" className="icon" />
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal id="resume">
        <div>
          <h1>Resume</h1>
          <div className="resume">
            <img src={MyResume} alt="Resume" width="775" />
            <button className="download-button" onClick={handleDownloadResume}>
              <FontAwesomeIcon icon={faDownload} /> Download Resume
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default App;