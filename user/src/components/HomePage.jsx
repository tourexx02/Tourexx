import HotelBookingSection from "./HotelBooking";
import ChatSection from "./Chat";
import DiningSection from "./DiningSection";
import TransportSection from "./TransportSection";
import TravelSection from "./TravelSection";
import NavbarHeroSection from "./HeroHome";

const HomePage = () => {
  return (
    <div>
      <main>
        <NavbarHeroSection />
        <ChatSection />
        <HotelBookingSection />
        <DiningSection />
        <TravelSection />
        <TransportSection />
      </main>
    </div>
  );
};

export default HomePage;
