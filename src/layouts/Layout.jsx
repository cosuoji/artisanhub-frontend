import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import InstallAppButton from "../components/InstallAppButton"

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-[#1F2937]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <InstallAppButton />
    </div>
  );
}