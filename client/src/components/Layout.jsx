import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        &copy; 2025 JobReadyHub. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
