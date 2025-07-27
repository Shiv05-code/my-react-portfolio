import './App.css';
import Me from './Me.jpg'; // Correct import
import MyResume from "./MyResume.jpg";
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
            <p>I'm a Junior at Cal State University of Long Beach
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
            <h1>Junior Achievment Intern</h1>
            <p> ~ Collaborated with a team to develop and execute targeted <b>email campaigns</b> to secure corporate funding for children's financial literacy programs.</p>
            <p> ~ Promoted a Vans campaign which <b>funded</b> programs for career readiness, financial literacy, and business building for <b>each</b> student.</p>
            <p> ~ Taught team members how to effectively utilize social platforms to leverage a large group of audience to gain <b>recognition</b> and <b>support</b>.</p>
          </div>
          <div className="experience-card">
            <h1>Optimus Learning School</h1>
            <p> ~ Instructed Kindergarten - <b>6th</b> graders during summer and after-school, <b>fostering growth</b> in learning strategies, discipline, and character development.</p>
            <p> ~ Designed and implemented <b>lesson plans</b> for groups of up to <b>20</b> students per session, ensuring engaging and age-appropriate instruction.</p>
            <p> ~ Provided individualized support to approximately <b>5</b> students per week, contributing to measurable <b>academic improvement</b>.</p>
          </div>
          <div className="experience-card">
            <h1>Best Buy</h1>
            <p> ~ Managed inventory for over <b>200 SKUs</b>, conducting regular audits to ensure <b>90%</b> inventory accuracy.</p>
            <p> ~ Assisted an average of <b>50</b> customers per week, offering product information and guidance, helping maintain a high level of <b>customer satisfaction</b>.</p>
            <p> ~ Supported the timely display of promotional items, contributing to a noticeable increase in <b>sales</b> during promotional periods.</p>
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
            <img src={MyResume} alt="Resume" width="775"></img>
          </div>
        </div>
      </section>
    </div>

  );
}



export default App;