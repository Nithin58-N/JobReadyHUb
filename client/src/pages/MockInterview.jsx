import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const MockInterview = () => {
    const [step, setStep] = useState('start'); // start, interview, result
    const [type, setType] = useState('Technical');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const startInterview = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/interview/start', { type });
            setQuestions(data.questions);
            setStep('interview');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (index, value) => {
        setAnswers(prev => ({ ...prev, [index]: value }));
    };

    const submitInterview = async () => {
        setLoading(true);
        try {
            const payload = questions.map((q, i) => ({
                questionText: q.questionText,
                userAnswer: answers[i] || ''
            }));

            const { data } = await api.post('/interview/submit', { type, answers: payload });
            setResult(data);
            setStep('result');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mock Interview AI</h1>

            {step === 'start' && (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <h2 className="text-xl font-semibold mb-6">Select Interview Type</h2>
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setType('Technical')}
                            className={`px-6 py-3 rounded-lg border-2 ${type === 'Technical' ? 'border-primary bg-indigo-50 text-primary' : 'border-gray-200'}`}
                        >
                            Technical Interview
                        </button>
                        <button
                            onClick={() => setType('HR')}
                            className={`px-6 py-3 rounded-lg border-2 ${type === 'HR' ? 'border-primary bg-indigo-50 text-primary' : 'border-gray-200'}`}
                        >
                            HR Interview
                        </button>
                    </div>
                    <button
                        onClick={startInterview}
                        disabled={loading}
                        className="bg-primary text-white px-8 py-3 rounded-md hover:bg-indigo-700 font-semibold"
                    >
                        {loading ? 'Generating Questions...' : 'Start Interview'}
                    </button>
                </div>
            )}

            {step === 'interview' && (
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Q{index + 1}: {q.questionText}</h3>
                            <textarea
                                rows={4}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border"
                                placeholder="Type your answer here..."
                                value={answers[index] || ''}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                    <button
                        onClick={submitInterview}
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white px-8 py-3 rounded-md hover:bg-emerald-700 font-semibold"
                    >
                        {loading ? 'Evaluating...' : 'Submit Answers'}
                    </button>
                </div>
            )}

            {step === 'result' && result && (
                <div className="bg-white p-8 rounded-lg shadow">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Results</h2>
                        <div className="text-5xl font-bold text-primary mb-2">{result.interviewScore}/100</div>
                        <p className="text-gray-600 italic">"{result.overallFeedback}"</p>
                    </div>

                    <div className="space-y-6">
                        {result.questions.map((q, index) => (
                            <div key={index} className="border-b pb-4 last:border-0">
                                <p className="font-semibold text-gray-900">Q: {q.questionText}</p>
                                <p className="text-gray-600 mt-1 mb-2">A: {q.userAnswer}</p>
                                <div className="bg-gray-50 p-3 rounded text-sm">
                                    <span className="font-medium text-indigo-600">AI Feedback: </span>
                                    {q.feedback} (Score: {q.score})
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-8 w-full bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800"
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default MockInterview;
