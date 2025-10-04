import { useRef, useState, useCallback, useEffect } from 'react';

import { loadFull } from "tsparticles";

import Logo from "/logo.png"

import Earth from "/earthm.png"
import Mars from "/Mars.png"
import Venus from "/Venus.png"

import Meteor from "/meteor.png"
import Meteor2 from "/meteor2.png"

// Icons
import { Orbit, ShieldCheck, Globe2Icon, Rocket, Eye, Users, Menu, X, RocketIcon } from "lucide-react"

const TypeAnimation = ({ sequence, wrapper, speed, className, repeat }) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const typingSpeed = speed || 50;
  const deletingSpeed = speed ? speed / 2 : 25;
  const delay = 1000;

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % sequence.length;
      const fullText = sequence[i];

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
      } else {
        setText(fullText.substring(0, text.length + 1));
      }

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const ticker = setTimeout(() => {
      handleTyping();
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(ticker);
  }, [text, isDeleting, loopNum, sequence, typingSpeed, deletingSpeed, delay]);

  const Wrapper = wrapper || 'span';

  return <Wrapper className={className}>{text}&nbsp;</Wrapper>;
};


function App() {
  const inActionRef = useRef(null);
  const aboutRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const handleScrollToAction = (e) => {
    e.preventDefault();
    inActionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='flex flex-col gap-5'>
    
    {/* main landing page */}
    <div className="bg-transparent h-[97vh] w-[97vw] mx-auto mt-auto mb-2 rounded-3xl translate-y-3 overflow-hidden border-2 border-white/30 shadow-lg relative">
      <nav className="relative flex items-center justify-between p-4 ml-5 text-white font-[Poppins]">
        {/* Logo on the left */}
          <a href="/">
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="Logo" className="w-20 h-20" />
              <span className="text-lg font-bold font-mono ">_Project Meteor </span>
            </div>
          </a>

        {/* Nav links centered */}
        <div className="absolute hidden md:flex text-md font-[550] left-1/2 transform -translate-x-1/2 gap-8 xl:gap-12 2xl:gap-16 2xl:text-lg">
          <a href="#" onClick={handleScrollToAbout} className="hover:text-lg transition-all ">About</a>
          <a href="#" onClick={handleScrollToAction} className="hover:text-lg transition-all ">Features</a>
        </div>

        {/* Menu Icon for mobile */}
        <div className="md:hidden">
          <button onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-[#0e1d28] w-64 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleSidebar}>
            <X size={24} className="text-white" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-8 mt-10 text-white">
          <a href="#" onClick={handleScrollToAbout} className="hover:text-lg transition-all ">About</a>
          <a href="#" onClick={handleScrollToAction} className="hover:text-lg transition-all ">In Action</a>
        </div>
      </div>

      <div>
        <TypeAnimation
          sequence={[
            "PROJECT METEOR: EARTH'S SHIELD",
            "PROJECT METEOR: EARTH'S DEFENSE",
            "PROJECT METEOR: EARTH'S GUARDIAN",
          ]}
          wrapper="h1"
          speed={80}
          className='flex justify-center text-7xl text-white mx-auto items-center font-[Poppins] font-[200] translate-y-15 '
          repeat={Infinity}
        />
      </div>

      <div className="flex justify-center items-center mt-10 translate-y-15"
      onClick={() => window.location.href = '/simulation'}
      >
        <button className="flex z-10 items-center justify-center gap-3 bg-red-400 hover:bg-red-500 transition-colors text-white text-3xl font-[Poppins] px-8 py-4 rounded-full w-100 shadow-lg">
          Launch Simulation
          <RocketIcon className="w-8 h-8" />
        </button>
      </div>

      <div className="">
        <div className="absolute z-100 
        xl:w-180 xl:h-70 xl:-bottom-30 
        right-1/2 translate-x-1/2 rounded-full bg-blue-300/30 blur-2xl"></div>
        
        <img src={Earth} alt="Earth image" 
          className='absolute w-170 opacity-90 
          -bottom-65
          sm:-bottom-70
          md:-bottom-150
          lg:-bottom-170
          
          xl:top-70

          2xl:top-90 
          2xl:w-360 
          3xl:w-400
          right-1/2 translate-x-1/2'
          />
      </div>

      {/* <img src={Meteor} alt="Meteor image"
        className='absolute rotate-10 w-30 right-70 top-110 '
      /> */}

      <img src={Mars} alt="Mars image"
        className='absolute w-32 sm:w-40 md:w-48 lg:w-52 xl:w-40 2xl:w-60 -right-5 sm:-right-6 md:-right-7 lg:-right-8 xl:-right-9 2xl:-right-10 rotate-75 top-60 sm:top-64 md:top-72 lg:top-80 xl:top-96 2xl:top-112 opacity-80
        '
      />
      <img src={Venus} alt="Venus image"
        className='absolute w-32 sm:w-40 md:w-48 lg:w-52 xl:w-40 2xl:w-60 -left-5 sm:-left-6 md:-left-7 lg:-left-8 xl:-left-9 2xl:-left-10 rotate-75 top-60 sm:top-64 md:top-72 lg:top-80 xl:top-96 2xl:top-112 opacity-80 '
      />

    </div>


    {/* About Section */}
    <div ref={aboutRef} className="bg-transparent text-white w-[97vw] mx-auto mt-1 p-10 rounded-3xl font-[Poppins] border-2 border-white/30  shadow-lg">
      <h2 className="text-4xl font-bold text-center mb-12 font-mono underline">About Us</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">

        <div className="bg-[#1a2a38]/50 p-6 rounded-xl border border-white/10 flex flex-col items-center">
          <Users className="w-12 h-12 mb-4 text-blue-400" />
          <h3 className="text-2xl font-semibold mb-2">Our Team</h3>
          <p className="text-white/70">A passionate group of Seniors 2026 making physics and space fun & educational.</p>
        </div>

        <div className="bg-[#1a2a38]/50 p-6 rounded-xl border border-white/10 flex flex-col items-center">
          <Rocket className="w-12 h-12 mb-4 text-red-400" />
          <h3 className="text-2xl font-semibold mb-2">Our Mission</h3>
          <p className="text-white/70">Inspire curiosity and teamwork through engaging, educational simulations.</p>
        </div>

        <div className="bg-[#1a2a38]/50 p-6 rounded-xl border border-white/10 flex flex-col items-center">
          <Eye className="w-12 h-12 mb-4 text-yellow-400" />
          <h3 className="text-2xl font-semibold mb-2">Our Vision</h3>
          <p className="text-white/70">Empower everyone to explore space science interactively.</p> 
          {/* To empower both technical and non-technical people like  astrophysicist, students and hobbyists to explore space science and strategy in an interactive way. */}
        </div>

      </div>
    </div>

    {/* In Action Section */}
    <div ref={inActionRef} className="bg-transparent text-white w-[97vw] mx-auto mt-1 p-10 rounded-3xl font-[Poppins] border-2 border-white/30  shadow-lg">
      <h2 className="text-4xl font-bold text-center mb-12 font-mono underline ">Features</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        
        <div className="bg-[#1a2a38]/50 p-6 rounded-xl border border-white/10 flex flex-col items-center">
          <Orbit className="w-12 h-12 mb-4 text-blue-400" />
          <h3 className="text-2xl font-semibold mb-2">Realistic Physics</h3>
          <p className="text-white/70">Experience a simulation governed by real-world physics and orbital mechanics.</p>
        </div>
        
        <div className="bg-[#1a2a38]/50 p-6 rounded-xl border border-white/10 flex flex-col items-center">
          <ShieldCheck className="w-12 h-12 mb-4 text-green-400" />
          <h3 className="text-2xl font-semibold mb-2">Defensive Scenarios</h3>
          <p className="text-white/70">Test various strategies to deflect or destroy incoming threats to protect the Earth.</p>
        </div>
        
        <div className="bg-[#1a2a38]/50 p-6 rounded-xl border border-white/10 flex flex-col items-center">
          <Globe2Icon className="w-12 h-12 mb-4 text-yellow-400" />
          <h3 className="text-2xl font-semibold mb-2">Impact Analysis</h3>
          <p className="text-white/70">Analyze the potential consequences of an impact, from local to global effects.</p>
        </div>


      </div>

      {/* Video placeholder */}
        <div className="w-full flex justify-center mt-8">
          <iframe
            className="w-full max-w-4xl aspect-video"
            src="https://www.youtube.com/embed/tgbNymZ7vqY"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
    </div>



    <Footer />
    </div>
  )
}

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-transparent text-white w-[97vw] mx-auto p-6 rounded-t-3xl mt-1 font-mono flex items-center justify-between border-2 border-white/30 border-b-0 shadow-lg">

      <a href="/">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-15 h-15 mr-3" />
        </div>
      </a>


      <p className="text-center flex-1">&copy; 2025 _Project Meteor. All Rights Reserved.</p>
    </footer>
  );
};

export default App