import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'antd'; // Assuming you have a separate Button component

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white px-4 py-4 flex justify-between items-center z-50">
            <Link href="/">
                <Image src="/logo.svg" alt="Logo" width={50} height={50} />
            </Link>
            <nav className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
                <Link href="/" className="text-gray-600 hover:text-purple-600 text-lg">
                    Home
                </Link>
                <Link href="/pre-grant/test" className="text-gray-600 hover:text-purple-600 text-lg">
                    Grants
                </Link>
                <Link href="/apps" className="text-gray-600 hover:text-purple-600 text-lg">
                    AI-Apps
                </Link>
                <Link href="https://x.com/Hubitingai" className="text-gray-600 hover:text-purple-600 text-lg" target="_blank" rel="noopener noreferrer">
                    X
                </Link>
                <Link href="https://explorer.gitcoin.co/#/projects/0x88fa0075b39259b7fa4ce709e60dcc63461086db3b3fccaced57bad0099a0ffa" className="text-gray-600 hover:text-purple-600 text-lg" target="_blank" rel="noopener noreferrer">
                    Donate
                </Link>
                <Link href="https://hubi-1.gitbook.io/hubi-docs" className="text-gray-600 hover:text-purple-600 text-lg" target="_blank" rel="noopener noreferrer">
                    Doc
                </Link>
            </nav>
            <Button href="/pre-grant/test" type="primary" className="bg-black hover:bg-gray-800">
                Launch App
            </Button>
        </header>
    );
};

export default Header;