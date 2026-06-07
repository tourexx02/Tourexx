import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToServices = () => {
    // If we're on the home page, scroll to services section
    if (location.pathname === '/') {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If we're on another page, navigate to home and then scroll
      navigate('/', { state: { scrollToServices: true } });
    }
  };

  return (
    <footer className="bg-[#577C8E] text-[#E0E0E0] font-['Poppins',sans-serif] pt-12 px-6 pb-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between flex-wrap pb-8 border-b border-white/20 animate-fade-in">
          {/* Left Section - Logo and Social Icons */}
          <div className="flex-[0_0_25%] min-w-[200px] mb-8 lg:mb-0 animate-slide-up">
            <div className="flex items-center  mb-6">
              <img src={logo} alt="Company Logo" width={200} height={80} />
            </div>
            <div className="flex pl-8 items-start sm:items-center gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-white text-xl transition-all duration-300 hover:text-[#A0C3D2] hover:scale-110"
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Section - Quick Links, Services, Contact */}
          <div className="flex-[0_0_70%] flex justify-between flex-wrap gap-4 mb-8 lg:mb-0 animate-slide-up-delayed">
            {/* Quick Links Column */}
            <div className="flex-[0_0_30%] min-w-[180px]">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="list-none p-0 m-0">
                {[
                  { name: "About Us", path: "/about", isScroll: false },
                  { name: "Our Services", path: "#", isScroll: true },
                ].map((link, index) => (
                  <li key={index} className="mb-3">
                    {link.isScroll ? (
                      <button
                        onClick={scrollToServices}
                        className="text-[#E0E0E0] no-underline text-sm font-normal transition-all duration-300 hover:text-white hover:translate-x-2 inline-block bg-transparent border-none cursor-pointer p-0"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-[#E0E0E0] no-underline text-sm font-normal transition-all duration-300 hover:text-white hover:translate-x-2 inline-block"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Column */}
            <div className="flex-[0_0_30%] min-w-[180px]">
              <h3 className="text-lg font-semibold text-white mb-4">
                Services
              </h3>
              <ul className="list-none p-0 m-0">
                {[
                  { name: "Hotel Reservations", path: "/services/hotels" },
                  { name: "Restaurant Booking", path: "/services/restaurants" },
                  { name: "Trip Organizer", path: "/services/trip-organizers" },
                  { name: "Transport Booking", path: "/services/transport" },
                ].map((service, index) => (
                  <li key={index} className="mb-3">
                    <Link
                      to={service.path}
                      className="text-[#E0E0E0] no-underline text-sm font-normal transition-all duration-300 hover:text-white hover:translate-x-2 inline-block"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div className="flex-[0_0_30%] min-w-[180px]">
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <div>
                {[
                  { icon: Phone, text: "+92-304-5678934" },
                  { icon: Mail, text: "example@gmail.com" },
                  { icon: MapPin, text: "123 Travel Street Islamabad" },
                ].map((contact, index) => (
                  <p
                    key={index}
                    className="flex items-center mb-3 text-sm text-[#E0E0E0] transition-all duration-300 hover:translate-x-2"
                  >
                    <contact.icon
                      className="mr-3 text-base text-white"
                      size={18}
                    />
                    {contact.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Policy Links */}
        <div className="flex justify-between items-center flex-wrap pt-6 mt-2 animate-slide-up-delayed">
          <p className="text-sm text-[#A0C3D2] mr-6">
            © 2025 TourEx, All rights reserved
          </p>
          <div className="flex">
            {[
              { name: "Privacy Policy", path: "#" },
              { name: "Terms of Service", path: "#" },
              { name: "Cookie Policy", path: "#" }
            ].map((policy, index) => (
                <Link
                  key={index}
                  to={policy.path}
                  className="text-[#A0C3D2] no-underline text-sm ml-6 transition-all duration-300 hover:text-white hover:-translate-y-1"
                >
                  {policy.name}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations and responsive styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }

        .animate-slide-up-delayed {
          animation: slideUp 0.5s ease-out 0.1s both;
        }

        @media (max-width: 992px) {
          .flex-\\[0_0_25\\%\\] {
            flex-basis: 100% !important;
            text-align: center;
            align-items: center;
            margin-bottom: 2.5rem;
          }

          .flex-\\[0_0_70\\%\\] {
            flex-basis: 100% !important;
            justify-content: space-around;
          }

          .flex-\\[0_0_30\\%\\] {
            flex-basis: 45% !important;
            min-width: unset;
            margin-bottom: 2rem;
          }

          .flex.justify-between.items-center.flex-wrap {
            flex-direction: column;
            text-align: center;
          }

          .text-sm.text-\\[\\#A0C3D2\\].mr-6 {
            margin-bottom: 1rem;
            margin-right: 0;
          }

          .flex > a {
            margin: 0 0.8rem;
          }
        }

        @media (max-width: 576px) {
          .flex-\\[0_0_30\\%\\] {
            flex-basis: 100% !important;
            text-align: center;
          }

          .text-lg.font-semibold.text-white.mb-4 {
            text-align: center;
          }

          .list-none,
          .contact-info {
            text-align: center;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
          }

          .flex.items-center {
            justify-content: center;
          }

          .flex > a {
            display: block;
            margin: 0.5rem 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
