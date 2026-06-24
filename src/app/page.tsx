import LandingHero from '@/components/LandingHero';
import LandingFeatures from '@/components/LandingFeatures';
import LandingHowItWorks from '@/components/LandingHowItWorks';
import LandingProfessions from '@/components/LandingProfessions';
import LandingCTA from '@/components/LandingCTA';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, webApplicationSchema, breadcrumbSchema } from '@/lib/schema';

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webApplicationSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
        ])}
      />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingProfessions />
      <LandingCTA />
      <Footer />
    </>
  );
}
