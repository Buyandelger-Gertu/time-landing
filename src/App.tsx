import { Apps } from "./components/apps";
import { Faq } from "./components/faq";
import { FeatureTabs } from "./components/feature-tabs";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { Modules } from "./components/modules";
import { Nav } from "./components/nav";
import { Pricing } from "./components/pricing";
import { SignUp } from "./components/signup";
import { Steps } from "./components/steps";

/**
 * Нэг хуудсан лэндинг.
 *
 * Дараалал нь худалдааны логиктой: юу болохыг хэлээд (Hero) → яаж
 * ажилладгийг үзүүлж (FeatureTabs, Modules, Apps) → эргэлзээг тайлаад
 * (Steps, Pricing, Faq) → үйлдэл рүү (SignUp) хөтөлнө.
 *
 * Router хэрэглээгүй: бүх хэсэг нэг хуудсанд байгаа тул `#id` дагасан
 * гүйлт хангалттай.
 */
export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeatureTabs />
        <Modules />
        <Apps />
        <Steps />
        <Pricing />
        <Faq />
        <SignUp />
      </main>
      <Footer />
    </>
  );
}
