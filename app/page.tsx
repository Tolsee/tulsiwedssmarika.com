'use client';

import { useState, useEffect } from 'react';
import RSVPForm from '../components/RSVPForm';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="font-script text-2xl md:text-3xl text-emerald-700">
              T & S
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-emerald-700 hover:text-pink-500 transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('story')}
                className="text-emerald-700 hover:text-pink-500 transition-colors font-medium"
              >
                Our Story
              </button>
              <button
                onClick={() => scrollToSection('details')}
                className="text-emerald-700 hover:text-pink-500 transition-colors font-medium"
              >
                Wedding Details
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-emerald-700 hover:text-pink-500 transition-colors font-medium"
              >
                Gallery
              </button>
              <button
                onClick={() => scrollToSection('rsvp')}
                className="bg-[#5a8a5e] hover:bg-[#456c49] text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                RSVP
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-emerald-700 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-pink-50 to-stone-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgb(232 240 232 / 0.8) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgb(252 231 237 / 0.8) 0%, transparent 50%)
          `
        }}>
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-emerald-200 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-pink-200 rounded-full animate-float opacity-40" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-20 w-3 h-3 bg-emerald-300 rounded-full animate-float opacity-50" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-10 w-5 h-5 bg-pink-300 rounded-full animate-float opacity-30" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="text-pink-500 font-script text-xl md:text-2xl mb-4">Together Forever</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-emerald-800 mb-6 drop-shadow-sm">
              Tulsi <span className="text-pink-500">&</span> Smarika
            </h1>
            <p className="text-xl md:text-2xl text-emerald-600 mb-8 max-w-2xl mx-auto">
              We're getting married and we want you to celebrate with us!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-emerald-100/50 text-center min-w-[200px]">
                <div className="text-2xl font-serif font-semibold text-emerald-700 mb-1">Save the Date</div>
                <div className="text-lg text-pink-500 font-medium">December 12, 2025</div>
                <div className="text-emerald-600">Kathmandu, Nepal</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('story')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Our Story
              </button>
              <button
                onClick={() => scrollToSection('rsvp')}
                className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                RSVP Now
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="heading-secondary mb-4">Our Love Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-pink-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every love story is beautiful, but ours is our favorite. Here's how it all began...
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold">💕</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-emerald-700 mb-2">The Meeting</h3>
                    <p className="text-gray-600">We were wanderers of the digital age — drawn together not by chance encounters in streets or cafés, but by electrons racing through hidden wires. The internet gods played their trick, and amidst a billion scrolling faces, our frequencies aligned. Pixels became sparks. Static became music.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-semibold">🌟</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-emerald-700 mb-2">The (Un)Proposal</h3>
                    <p className="text-gray-600">They say love demands a grand proposal beneath the stars. Ours has been more of a running satire — the constellations gossip, satellites circle, and yet the WiFi still waits for me to buffer the words she longs to hear. She teases, I stall; perhaps the universe enjoys the comedy.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold">💍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-emerald-700 mb-2">Our Journey</h3>
                    <p className="text-gray-600">Distance tested us in ways silence never could. Time zones stretched our patience, calls dropped mid-laughter, and longing often lived between messages left unsent. Yet through the ache of waiting, we found strength. Love survived the lag, grew louder than loneliness, and carried us forward — two souls syncing despite the miles.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-200 to-pink-200 rounded-2xl flex items-center justify-center">
                <div className="text-6xl">📸</div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center">
                <div className="text-2xl">💖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section id="details" className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-secondary mb-4">Wedding Details</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-pink-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              All the important information you need to celebrate with us
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🗓️</span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-emerald-700 mb-4">Date & Time</h3>
              <p className="text-gray-600 mb-2">December 12, 2025</p>
              <p className="text-gray-600">4:00 PM onwards</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-emerald-700 mb-4">Venue</h3>
              <p className="text-gray-600 mb-2">Garden of Dreams</p>
              <p className="text-gray-600">Kathmandu, Nepal</p>
            </div>

            <div className="card text-center md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-emerald-700 mb-4">Dress Code</h3>
              <p className="text-gray-600 mb-2">Semi-formal</p>
              <p className="text-gray-600">Pastel colors welcome!</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="card max-w-2xl mx-auto">
              <h3 className="text-xl font-serif font-semibold text-emerald-700 mb-4">Schedule</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Welcome & Registration</span>
                  <span className="text-emerald-600 font-medium">4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ceremony</span>
                  <span className="text-emerald-600 font-medium">5:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cocktail Hour</span>
                  <span className="text-emerald-600 font-medium">6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reception & Dinner</span>
                  <span className="text-emerald-600 font-medium">7:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dancing & Celebration</span>
                  <span className="text-emerald-600 font-medium">9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-secondary mb-4">Our Memories</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-pink-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A glimpse into our journey together
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { src: "/images/15.jpeg", alt: "Tulsi & Smarika - Photo 1" },
              { src: "/images/17.jpeg", alt: "Tulsi & Smarika - Photo 2" },
              { src: "/images/5.jpeg", alt: "Tulsi & Smarika - Photo 3" },
              { src: "/images/6.jpeg", alt: "Tulsi & Smarika - Photo 4" }
            ].map((photo, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn-primary">View More Photos</button>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="section-padding gradient-bg">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-secondary mb-4">RSVP</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-pink-400 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please let us know if you can make it to our special day
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <RSVPForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-emerald-900 to-slate-900 text-white">
        <div className="container-custom py-16">
          <div className="text-center mb-12">
            <div className="font-script text-4xl mb-4 text-white">Tulsi & Smarika</div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-pink-400 mx-auto mb-6"></div>
            <p className="text-gray-100 text-lg mb-8 max-w-md mx-auto">
              Thank you for being part of our love story and sharing in our special day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🗓️</span>
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-white">Wedding Date</h3>
              <p className="text-gray-200">December 12, 2025</p>
              <p className="text-gray-200 text-sm">4:00 PM onwards</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📍</span>
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-white">Location</h3>
              <p className="text-gray-200">Garden of Dreams</p>
              <p className="text-gray-200 text-sm">Kathmandu, Nepal</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">💌</span>
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2 text-white">RSVP</h3>
              <p className="text-gray-200">Please respond by</p>
              <p className="text-gray-200 text-sm">November 15, 2025</p>
            </div>
          </div>

          <div className="text-center border-t border-gray-600 pt-8">
            <div className="flex justify-center items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💕</span>
                <span className="text-gray-200 text-sm">Est. 2023</span>
              </div>
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🌟</span>
                <span className="text-gray-200 text-sm">Forever & Always</span>
              </div>
            </div>

            <p className="text-gray-200 text-sm mb-4">
              "Love is not about how many days, months, or years you have been together.<br />
              Love is about how much you love each other every single day."
            </p>

            <div className="text-gray-300 text-xs">
              © 2025 Tulsi & Smarika • Made with 💖 for our special day
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
