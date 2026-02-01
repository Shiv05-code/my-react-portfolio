import './App.css';
import Me from './Me.jpg';
import MyResume from "./MyResume.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {faEnvelope, faDownload} from '@fortawesome/free-solid-svg-icons';
import { ReactTyped } from 'react-typed';
import { useState } from 'react';

function App() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Function to handle resume download
  const handleDownloadResume = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = MyResume;
    link.download = 'Shivansh_Kanda_Resume.jpg'; // Set the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <header className="header">
        <nav className="navbar">
          <ul className="navbar-list">
            <li> <a href="#about">About</a></li>
            <li> <a href="#experience">Experience</a></li>
            <li> <a href="#socials">Socials</a></li>
            <li> <a href="#resume">Resume</a></li>
          </ul>
        </nav>
      </header>
      <section id="about">
        <h3>Hello, I'm</h3>
        <h1 className="typing-container">
          <ReactTyped
          strings={["Shivansh Kanda"]}
          typeSpeed={100}
          showCursor={true}
          cursorChar="|"
          />
        </h1>
        <div className='Me'>
          <img src={Me} alt="Description" width="300" ></img>
          <div className="Info">
            <p>I'm a Junior at Cal State University of Long Beach
            working towards my Bachelor's Degree in Computer Science. I'm passionate about technology and
            intrigued by the way it shapes our world. I enjoy tackling challenging problems
            to discover creative solutions. In my free time, you'll see me hitting the gym, playing my flute,
            or being one with nature. 
            </p>
          </div>
        </div>
      </section>

      <section id="experience">
        <h1>Experience</h1>
        <div className="experience-cards">

          {/* Card 1 */}
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
      </section>

      <section id="socials">
        <h1>Socials</h1>
        <div className="icon-container">
          <div className="social-icon">
            <a href="https://www.linkedin.com/in/shivansh-kanda-08a443294/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} size="3x" className="icon"/>
            </a>
          </div>
          <div className="social-icon">
            <a href="mailto:shivanshkanda@gmail.com">
              <FontAwesomeIcon icon={faEnvelope} size="3x" className="icon"/>
            </a>
          </div>
        </div>
      </section>

      <section id="resume">
        <div>
          <h1>Resume</h1>
          <div className="resume">
            <img src={MyResume} alt="Resume" width="775"></img>
            <button className="download-button" onClick={handleDownloadResume}>
              <FontAwesomeIcon icon={faDownload} /> Download Resume
            </button>
          </div>
        </div>
      </section>
    </div>

  );
}



export default App;