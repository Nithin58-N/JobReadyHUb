import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ScoreHistoryChart, ScoreDoughnut } from '../components/Charts';
import { FileText, Mic, BookOpen, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const historyRes = await api.get('/score/history');
                const scoreRes = await api.get('/score/current');
                setHistory(historyRes.data);
                setCurrentScore(scoreRes.data.score);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="py-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {user?.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Score Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Job Readiness Score</h2>
                    <div className="w-40 h-40 relative">
                        <ScoreDoughnut score={currentScore} />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-4xl font-bold text-primary">{currentScore}</span>
                            <span className="text-xs text-gray-400">/ 100</span>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Keep improving your skills!</p>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-lg md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link to="/resume" className="flex flex-col items-center p-4 border rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer group">
                            <div className="p-3 bg-indigo-100 rounded-full mb-3 group-hover:bg-white">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <span className="font-medium text-gray-900">Resume Analyzer</span>
                            <span className="text-xs text-gray-500 text-center mt-1">Check your resume score</span>
                        </Link>
                        <Link to="/interview" className="flex flex-col items-center p-4 border rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer group">
                            <div className="p-3 bg-emerald-100 rounded-full mb-3 group-hover:bg-white">
                                <Mic className="h-6 w-6 text-emerald-600" />
                            </div>
                            <span className="font-medium text-gray-900">Mock Interview</span>
                            <span className="text-xs text-gray-500 text-center mt-1">Practice with AI</span>
                        </Link>
                        <Link to="/skills" className="flex flex-col items-center p-4 border rounded-lg hover:bg-amber-50 transition-colors cursor-pointer group">
                            <div className="p-3 bg-amber-100 rounded-full mb-3 group-hover:bg-white">
                                <BookOpen className="h-6 w-6 text-amber-600" />
                            </div>
                            <span className="font-medium text-gray-900">Skill Suggestions</span>
                            <span className="text-xs text-gray-500 text-center mt-1">Bridge your gaps</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <ScoreHistoryChart history={history} />
            </div>
        </div>
    );
};

export default Dashboard;
