import Hero from "../components/Hero";
import Preloader from "../components/Preloader";


export default function Home() {
  return (
    <main className="w-screen overflow-hidden">
      <Preloader />
      <Hero />
    </main>
  );
}
