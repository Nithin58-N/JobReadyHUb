import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold text-primary">
                            JobReadyHub
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary">Dashboard</Link>
                                <div className="flex items-center space-x-2">
                                    <UserIcon className="h-5 w-5 text-gray-500" />
                                    <span className="text-gray-900 font-medium">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 hover:text-red-800"
                                >
                                    <LogOut className="h-5 w-5 mr-1" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-primary">Login</Link>
                                <Link to="/signup" className="text-white bg-primary hover:bg-indigo-700 px-4 py-2 rounded-md">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
