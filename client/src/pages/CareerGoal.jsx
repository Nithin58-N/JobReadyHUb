import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const CareerGoal = () => {
    const [goal, setGoal] = useState('Software Engineer');
    const navigate = useNavigate();
    const { setUser, user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/user/career-goal', { careerGoal: goal });
            // Update local user state
            setUser(data);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="mx-auto max-w-2xl py-12 px-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                Select Your Career Goal
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 ring-primary">
                        <input
                            type="radio"
                            id="swe"
                            name="goal"
                            value="Software Engineer"
                            checked={goal === 'Software Engineer'}
                            onChange={(e) => setGoal(e.target.value)}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="swe" className="block text-sm font-medium text-gray-900 w-full cursor-pointer">
                            Software Engineer
                        </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 ring-primary">
                        <input
                            type="radio"
                            id="da"
                            name="goal"
                            value="Data Analyst"
                            checked={goal === 'Data Analyst'}
                            onChange={(e) => setGoal(e.target.value)}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="da" className="block text-sm font-medium text-gray-900 w-full cursor-pointer">
                            Data Analyst
                        </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 ring-primary">
                        <input
                            type="radio"
                            id="cyber"
                            name="goal"
                            value="Cybersecurity"
                            checked={goal === 'Cybersecurity'}
                            onChange={(e) => setGoal(e.target.value)}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="cyber" className="block text-sm font-medium text-gray-900 w-full cursor-pointer">
                            Cybersecurity
                        </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 focus-within:ring-2 ring-primary">
                        <input
                            type="radio"
                            id="web"
                            name="goal"
                            value="Web Developer"
                            checked={goal === 'Web Developer'}
                            onChange={(e) => setGoal(e.target.value)}
                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="web" className="block text-sm font-medium text-gray-900 w-full cursor-pointer">
                            Web Developer
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-8 rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 w-full"
                >
                    Save and Continue
                </button>
            </form>
        </div>
    );
};

export default CareerGoal;
