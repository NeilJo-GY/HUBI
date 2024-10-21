'use client';
// navbar.js
import Link from 'next/link';
import { Connect } from "@/app/components/ConnectButton";


interface NavbarProps {
  className?: string; // 可选属性
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <>
      <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Bungee+Tint&display=swap');
    `}</style>
      <nav className={`${className} bg-gray-800 p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span
              className="text-gray-800 text-3xl font-normal px-2 py-1 rounded"
              style={{
                fontFamily: '"Bungee Tint", sans-serif',
                backgroundColor: 'white',
              }}
            >
              H.i
            </span>
          </Link>
          <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/pre-grant/test" className="text-gray-300 hover:text-white mx-2">
              Pre-Grant
            </Link>
          </div>
          <Connect />
        </div>
      </nav>
    </>
  );
};

export default Navbar;