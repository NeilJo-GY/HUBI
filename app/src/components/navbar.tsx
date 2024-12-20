'use client';
// navbar.js
import Link from 'next/link';
import { Connect } from "@/app/src/components/ConnectButton";


interface NavbarProps {
  className?: string; // 可选属性
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <>
      <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Bungee+Tint&display=swap');
    `}</style>
      <nav className={`${className} bg-gray-800 py-2`}>
        <div className="mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span
              className="text-gray-800 text-3xl font-normal px-2 py-1 rounded"
              style={{
                fontFamily: '"Bungee Tint", sans-serif',
                backgroundColor: 'white',
              }}
            >
              U.G
            </span>
          </Link>
          <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/pre-grant/test" className="text-gray-300 hover:text-white mx-2">
              Pre-Grant
            </Link>
          </div>
          <div className="ml-auto">
            <Connect />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;