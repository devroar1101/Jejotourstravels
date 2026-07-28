import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import Philosophy from '@/components/sections/Philosophy';
import MaskedBand from '@/components/sections/MaskedBand';
import SignatureJourneys from '@/components/sections/SignatureJourneys';
import Destinations from '@/components/sections/Destinations';
import ScrubMoment from '@/components/sections/ScrubMoment';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import Enquiry from '@/components/sections/Enquiry';
import WordmarkKnockout from '@/components/sections/WordmarkKnockout';
import Footer from '@/components/sections/Footer';

export default function Page() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Philosophy />
        <MaskedBand word="Journeys" media="masked" />
        <SignatureJourneys />
        <Destinations />
        <ScrubMoment />
        <Services />
        <Testimonials />
        <Enquiry />
        <WordmarkKnockout word="JEJO" media="hero" />
        <Footer />
      </main>
    </>
  );
}
