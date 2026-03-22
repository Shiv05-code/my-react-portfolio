import './App.css';
import Me from './Me.jpg';
import MyResume from "./MyResume.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import DremioLogo from './assets/dremio.svg';
import { faEnvelope, faDownload, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ReactTyped } from 'react-typed';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────
// Scroll Progress Bar
// ─────────────────────────────────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="scroll-progress-track">
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Cursor Trail
// ─────────────────────────────────────────────────────────────
function CursorTrail() {
  const canvasRef = useRef(null);
  const dotsRef   = useRef([]);
  const mouseRef  = useRef({ x: -999, y: -999 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // spawn a new dot at cursor
      dotsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1,
        r: Math.random() * 3 + 2,
      });
      // cap trail length
      if (dotsRef.current.length > 28) dotsRef.current.shift();
    };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dotsRef.current.forEach((dot, i) => {
        dot.alpha -= 0.035;
        if (dot.alpha < 0) dot.alpha = 0;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(136, 197, 211, ${dot.alpha})`;
        ctx.shadowColor = 'rgba(136, 197, 211, 0.6)';
        ctx.shadowBlur  = 8;
        ctx.fill();
      });
      // remove fully faded dots
      dotsRef.current = dotsRef.current.filter(d => d.alpha > 0);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail-canvas" />;
}

// ─────────────────────────────────────────────────────────────
// Reveal (scroll-triggered)
// ─────────────────────────────────────────────────────────────
function Reveal({ children, className = "", ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("is-visible"); observer.unobserve(el); }
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

// ─────────────────────────────────────────────────────────────
// Global shared clock
// ─────────────────────────────────────────────────────────────
const AUTO_INTERVAL = 1800;

const globalClock = {
  listeners: new Set(),
  timerId: null,
  start() {
    if (this.timerId !== null) return;
    this.timerId = setInterval(() => {
      this.listeners.forEach(fn => fn());
    }, AUTO_INTERVAL);
  },
  stop() {
    if (this.timerId !== null) { clearInterval(this.timerId); this.timerId = null; }
  },
  subscribe(fn) {
    this.listeners.add(fn);
    if (this.listeners.size === 1) this.start();
    return () => {
      this.listeners.delete(fn);
      if (this.listeners.size === 0) this.stop();
    };
  },
};

// ─────────────────────────────────────────────────────────────
// useMomentumCarousel
// ─────────────────────────────────────────────────────────────
function useMomentumCarousel(items, autoDir = 1) {
  const ITEM_W      = 140;
  const PAUSE_AFTER = 3500;
  const FRICTION    = 0.92;
  const SNAP_THRESH = 0.5;
  const n = items.length;

  const offsetRef   = useRef(0);
  const velRef      = useRef(0);
  const rafRef      = useRef(null);
  const pauseRef    = useRef(null);
  const pausedRef   = useRef(false);
  const draggingRef = useRef(false);
  const lastXRef    = useRef(0);
  const lastTimeRef = useRef(0);
  const sampleRef   = useRef([]);

  const [offset, setOffset]           = useState(0);
  const [isDragging, setIsDragging]   = useState(false);
  const [centeredKey, setCenteredKey] = useState(null);

  const cancelRaf   = () => { if (rafRef.current)  { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };
  const cancelPause = () => { if (pauseRef.current) { clearTimeout(pauseRef.current);       pauseRef.current = null; } };

  const popCenter = useCallback((curOffset) => {
    const snappedIndex = Math.round(-curOffset / ITEM_W);
    const centerIdx    = ((snappedIndex + 1) % n + n) % n;
    const key = items[centerIdx].key;
    setCenteredKey(null);
    requestAnimationFrame(() => setCenteredKey(key));
  }, [items, n]);

  const snapTo = useCallback((currentOffset, afterSnap) => {
    const nearest = Math.round(currentOffset / ITEM_W) * ITEM_W;
    let cur = currentOffset;
    const step = () => {
      cur += (nearest - cur) * 0.18;
      if (Math.abs(nearest - cur) < 0.3) {
        cur = nearest;
        offsetRef.current = cur;
        setOffset(cur);
        popCenter(cur);
        if (afterSnap) afterSnap();
        return;
      }
      offsetRef.current = cur;
      setOffset(cur);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [popCenter]);

  const coast = useCallback(() => {
    const step = () => {
      velRef.current *= FRICTION;
      if (Math.abs(velRef.current) < SNAP_THRESH) {
        velRef.current = 0;
        snapTo(offsetRef.current, () => {
          pausedRef.current = true;
          pauseRef.current  = setTimeout(() => { pausedRef.current = false; }, PAUSE_AFTER);
        });
        return;
      }
      offsetRef.current += velRef.current;
      setOffset(offsetRef.current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [snapTo]);

  const autoTickRef = useRef(null);
  const autoTick = useCallback(() => {
    if (draggingRef.current || pausedRef.current) return;
    cancelRaf();
    const target = offsetRef.current - autoDir * ITEM_W;
    let cur = offsetRef.current;
    const step = () => {
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.5) {
        cur = target;
        offsetRef.current = cur;
        setOffset(cur);
        popCenter(cur);
        return;
      }
      offsetRef.current = cur;
      setOffset(cur);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [autoDir, popCenter]);

  useEffect(() => { autoTickRef.current = autoTick; }, [autoTick]);

  useEffect(() => {
    const unsub = globalClock.subscribe(() => autoTickRef.current?.());
    return () => { unsub(); cancelRaf(); cancelPause(); };
  }, []); // eslint-disable-line

  const onPointerDown = useCallback((e) => {
    cancelRaf(); cancelPause();
    pausedRef.current  = false;
    draggingRef.current = true;
    setIsDragging(true);
    velRef.current = 0;
    sampleRef.current = [];
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastXRef.current   = clientX;
    lastTimeRef.current = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const now     = performance.now();
    const dx      = clientX - lastXRef.current;
    const dt      = now - lastTimeRef.current || 1;
    lastXRef.current    = clientX;
    lastTimeRef.current = now;
    offsetRef.current  += dx;
    setOffset(offsetRef.current);
    sampleRef.current.push({ dx, dt });
    if (sampleRef.current.length > 6) sampleRef.current.shift();
  }, []);

  const onPointerUp = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    const samples = sampleRef.current;
    if (samples.length > 0) {
      const totalDx = samples.reduce((s, v) => s + v.dx, 0);
      const totalDt = samples.reduce((s, v) => s + v.dt, 0);
      velRef.current = totalDt > 0 ? (totalDx / totalDt) * 16 : 0;
    } else {
      velRef.current = 0;
    }
    velRef.current = Math.max(-30, Math.min(30, velRef.current));
    coast();
  }, [coast]);

  const getItems = useCallback(() => {
    const baseIndex = Math.floor(-offset / ITEM_W);
    return [0, 1, 2, 3].map((slot) => {
      const idx          = ((baseIndex + slot) % n + n) % n;
      const xPos         = offset + (baseIndex + slot) * ITEM_W;
      const snappedIndex = Math.round(-offset / ITEM_W);
      const centerIdx    = ((snappedIndex + 1) % n + n) % n;
      const isPopped     = items[idx].key === centeredKey && idx === centerIdx;
      return { item: items[idx], xPos, slot, isPopped };
    });
  }, [offset, items, n, centeredKey]);

  return {
    getItems,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave: onPointerUp,
      onTouchStart: onPointerDown,
      onTouchMove: onPointerMove,
      onTouchEnd: onPointerUp,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// CarouselTrack
// ─────────────────────────────────────────────────────────────
function CarouselTrack({ items, autoDir, className, itemClassName, renderItem }) {
  const { getItems, isDragging, handlers } = useMomentumCarousel(items, autoDir);
  const renderedItems = getItems();
  return (
    <div
      className={`${className} ${isDragging ? "is-dragging" : ""}`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      {...handlers}
    >
      {renderedItems.map(({ item, xPos, slot, isPopped }) => (
        <div
          key={`${item.key}-${slot}`}
          className={`${itemClassName} ${isPopped ? "is-popped" : ""}`}
          style={{ transform: `translateX(${xPos}px)`, transition: isDragging ? "none" : undefined }}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Page-load entrance: flip to true after first paint
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const sections = useMemo(() => ["about", "experience", "socials", "resume"], []);
  const [activeSection, setActiveSection] = useState("about");

  const languages = useMemo(() => ([
    { key: "python", label: "Python",     iconClass: "devicon-python-plain" },
    { key: "c",      label: "C",          iconClass: "devicon-c-plain" },
    { key: "cpp",    label: "C++",        iconClass: "devicon-cplusplus-plain" },
    { key: "html",   label: "HTML",       iconClass: "devicon-html5-plain" },
    { key: "css",    label: "CSS",        iconClass: "devicon-css3-plain" },
    { key: "js",     label: "JavaScript", iconClass: "devicon-javascript-plain" },
    { key: "mysql",  label: "MySQL",      iconClass: "devicon-mysql-plain" },
  ]), []);

  const tools = useMemo(() => ([
    { key: "docker",  label: "Docker",  iconClass: "devicon-docker-plain" },
    { key: "postman", label: "Postman", iconClass: "devicon-postman-plain" },
    { key: "dremio",  label: "Dremio",  imgSrc: DremioLogo },
    { key: "api",     label: "APIs",    iconClass: "devicon-nodejs-plain" },
  ]), []);

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  useEffect(() => {
    const navOffset = 95;
    const onScroll = () => {
      const pos = window.scrollY + navOffset;
      let current = sections[0];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= pos) current = id;
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const [flippedCards, setFlippedCards] = useState({});
  const toggleFlip = (cardId) =>
    setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = MyResume;
    link.download = 'Shivansh_Kanda_Resume.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderLangItem = (item) => (
    <div className="lang-pill">
      <i className={`lang-devicon ${item.iconClass ?? ""}`} aria-hidden="true" />
      <span className="lang-label">{item.label}</span>
    </div>
  );

  const renderToolItem = (item) => (
    <div className="lang-pill">
      {item.imgSrc
        ? <img src={item.imgSrc} alt={item.label} className="tool-logo" />
        : <i className={`lang-devicon ${item.iconClass}`} aria-hidden="true" />
      }
      <span className="lang-label">{item.label}</span>
    </div>
  );

  return (
    <div className="app">
      <ScrollProgress />
      <CursorTrail />

      {/* ── Navbar (entrance slot 0) ── */}
      <header className={`header entrance-0 ${loaded ? "entrance-visible" : ""}`}>
        <nav className="navbar">
          <button className="theme-toggle" onClick={() => setDarkMode(prev => !prev)}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <ul className="navbar-list">
            {["about", "experience", "socials", "resume"].map(id => (
              <li key={id}>
                <a href={`#${id}`} className={activeSection === id ? "nav-active" : ""}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <Reveal id="about">
        {/* greeting (entrance slot 1) */}
        <h3 className={`entrance-1 ${loaded ? "entrance-visible" : ""}`}>Hello, I'm</h3>

        {/* name (entrance slot 2) */}
        <h1 className={`typing-container entrance-2 ${loaded ? "entrance-visible" : ""}`}>
          <ReactTyped strings={["Shivansh Kanda"]} typeSpeed={100} showCursor cursorChar="|" />
        </h1>
        {/* Role cycling typewriter */}
        <h2 className={`role-typer entrance-2 ${loaded ? "entrance-visible" : ""}`}>
          <ReactTyped
            strings={["CS Student", "Aspiring Software Developer", "Lifelong Learner"]}
            typeSpeed={60}
            backSpeed={35}
            backDelay={1800}
            loop
            showCursor
            cursorChar="|"
          />
        </h2>

        {/* about card (entrance slot 3) */}
        <div className={`Me entrance-3 ${loaded ? "entrance-visible" : ""}`}>
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
        <CarouselTrack items={languages} autoDir={1}  className="lang-carousel"  itemClassName="lang-item" renderItem={renderLangItem} />
        <CarouselTrack items={tools}     autoDir={-1} className="tools-carousel" itemClassName="tool-item" renderItem={renderToolItem} />

        <div className="experience-cards">
          {[
            { id: 'card1', front: 'Junior Achievement Intern', date: 'Jul. 2025 - Present', points: [
              'Collaborated on targeted email campaigns to secure corporate funding for children\'s financial literacy programs.',
              'Supported a Vans campaign funding student career readiness, financial literacy, and business development initiatives.',
              'Trained team members to leverage social media for broader reach and engagement.',
            ]},
            { id: 'card2', front: 'Optimus Learning School', date: 'Jul. 2024 - Jan. 2025', points: [
              'Instructed K–6 students in summer and after-school programs, supporting learning strategies, discipline, and character development.',
              'Designed and delivered engaging, age-appropriate lessons for groups of up to 20 students.',
              'Provided individualized support to select students, leading to measurable academic improvement.',
            ]},
            { id: 'card3', front: 'Best Buy', date: 'Oct. 2023 - Jan. 2024', points: [
              'Managed inventory for 200+ SKUs, conducting regular audits to maintain 90% accuracy.',
              'Assisted an average of 50 customers weekly by providing product guidance and support.',
              'Helped execute timely promotional displays, contributing to increased sales during campaigns.',
            ]},
          ].map(({ id, front, date, points }) => (
            <div key={id} className={`flip-card ${flippedCards[id] ? 'flipped' : ''}`} onClick={() => toggleFlip(id)}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <h1>{front}</h1>
                  <p className="click-hint">Click here to see more</p>
                </div>
                <div className="flip-card-back">
                  <h2>{date}</h2>
                  {points.map((pt, i) => <p key={i}><b>~</b> {pt}</p>)}
                </div>
              </div>
            </div>
          ))}
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
            {/* ── Replace href with your GitHub URL ── */}
            <a href="https://github.com/Shiv05-code" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} size="3x" className="icon" />
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