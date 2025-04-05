import './App.css';
import Me from './Me.jpg'; // Correct import
import ShivanshResume from "./ShivanshResume.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
function App() {
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
        <h1>Shivansh Kanda</h1>
        <div className='Me'>
          <img src={Me} alt="Description" width="300" ></img>
          <div className="Info">
            <p>I'm a Sophomore at Cal State University of Long Beach
            pursuing my Bachelor's Degree in Computer Science. Passionate about technology,
            I am fascinated by the way it shapes our world and enjoy tackling challenging problems
            to find innovative solutions. In my free time, I enjoy working out, playing the flute,
            and spending time in nature.
            </p>
          </div>
        </div>
      </section>

      <section id="experience">
        <h1>Experience</h1>
        <div className="experience-cards">
          <div className="experience-card">
            <h1>Optimus Learning School</h1>
            <p>Tutored K-6th graders to develop critical thinking, discipline, and growth.</p>
          </div>
          <div className="experience-card">
            <h1>Best Buy</h1>
            <p>Provided customer service and managed inventory as a Product Flow Specialist.</p>
          </div>
        </div>


      </section>

      <section id="socials">
        <h1>Socials</h1>
        <div className="icon-container">
          <div className="LinkedInIcon">
            <a href="https://www.linkedin.com/in/shivansh-kanda-08a443294/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} size="3x" className="LinkedInIcon"/>
            </a>
          </div>
        </div>

      </section>

      <section id="resume">
        <div>
          <h1>Resume</h1>
          <div className="resume">
            <img src={ShivanshResume} alt="Resume" width="775"></img>
          </div>
        </div>
      </section>
    </div>

  );
}



export default App;