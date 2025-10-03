import { useRef } from 'react';

import Logo from "/logo.png"
import Earth from "/earth.png"
import Meteor from "/meteor.png"
import Meteor2 from "/meteor2.png"

// Icons
import { Orbit, ShieldCheck, Globe2Icon, Rocket, Eye, Users } from "lucide-react"

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-[#0e1d28] text-white w-[97vw] mx-auto p-6 rounded-t-3xl mt-1 font-mono flex items-center justify-between">

      <a href="/">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="w-15 h-15 mr-3" />
        </div>
      </a>


      <p className="text-center flex-1">&copy; 2025 _Project Meteor. All Rights Reserved.</p>
    </footer>
  );
};

function App() {
  const inActionRef = useRef(null);
  const aboutRef = useRef(null);

  const handleScrollToAction = (e) => {
    e.preventDefault();
    inActionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='flex flex-col gap-5'>
    
    {/* main landing page */}
    <div className="bg-[#0e1d28] h-[97vh] w-[97vw] mx-auto mt-auto mb-3 rounded-3xl translate-y-3 overflow-hidden ">

      <nav className="relative flex items-center justify-between p-4 ml-5 text-white font-[Poppins]">
        {/* Logo on the left */}
          <a href="/">
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="Logo" className="w-20 h-20" />
              <span className="text-lg font-bold font-mono ">_Project Meteor </span>
            </div>
          </a>

        {/* Nav links centered */}
        <div className="absolute hidden md:flex text-md font-[550] left-1/2 transform -translate-x-1/2 gap-8">
          <a href="#" onClick={handleScrollToAbout} className="hover:text-lg transition-all ">About</a>
          <a href="#" onClick={handleScrollToAction} className="hover:text-lg transition-all ">In Action</a>
        </div>
      </nav>

      <div className="">
        <div className="absolute z-100 w-70 h-70 -bottom-10 -left-15 rounded-full bg-gray-100/60 blur-2xl"></div>
        
        <img src={Earth} alt="Earth image" 
          className='absolute w-170 top-35 -left-50'
          />
      </div>

      <img src={Meteor} alt="Meteor image"
        className='absolute w-80 right-10 rotate-75 top-110 '
      />

    </div>


    {/* About Section */}
    <div ref={aboutRef} className="bg-[#0e1d28] text-white w-[97vw] mx-auto mt-1 p-10 rounded-3xl font-[Poppins]">
      <h2 className="text-4xl font-bold text-center mb-12 font-mono underline">About Us</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">

        <div className="bg-[#1a2a38]/50 p-6 rounded-xl border border-white/10 flex flex-col items-center">
          <Users className="w-12 h-12 mb-4 text-blue-400" />
          <h3 className="text-2xl font-semibold mb-2">Our Team</h3>
          <p className="text-white/70">A passionate group of seniors 2026 making physics and space fun & educational.</p>
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
    <div ref={inActionRef} className="bg-[#0e1d28] text-white w-[97vw] mx-auto mt-1 p-10 rounded-3xl font-[Poppins]">
      <h2 className="text-4xl font-bold text-center mb-12 font-mono underline ">In Action</h2>
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

export default App
