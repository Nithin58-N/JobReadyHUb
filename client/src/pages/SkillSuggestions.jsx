import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BookOpen, Check } from 'lucide-react';

const SkillSuggestions = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSkills = async () => {
        try {
            const { data } = await api.get('/skills/recommendations');
            setSkills(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const completeSkill = async (id) => {
        try {
            const { data } = await api.post('/skills/complete', { skillId: id });
            setSkills(skills.map(s => s._id === id ? data : s));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Skill Recommendations</h1>

            {loading ? (
                <p>Loading recommendations...</p>
            ) : skills.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                    No suggestions yet. Try analyzing your resume or taking an interview!
                </div>
            ) : (
                <div className="grid gap-4">
                    {skills.map((skill) => (
                        <div key={skill._id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between border-l-4 border-indigo-500">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{skill.skillName}</h3>
                                <p className="text-sm text-gray-500">Source: {skill.source}</p>
                            </div>
                            <div>
                                {skill.status === 'Completed' ? (
                                    <span className="flex items-center text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                                        <Check className="w-4 h-4 mr-1" /> Completed
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => completeSkill(skill._id)}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition"
                                    >
                                        Mark as Done
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SkillSuggestions;
