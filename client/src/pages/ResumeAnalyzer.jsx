import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchAnalysis = async () => {
        try {
            const { data } = await api.get('/resume/analysis');
            setAnalysis(data);
        } catch (err) {
            // ignore 404
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file);

        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/resume/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAnalysis(data);
        } catch (err) {
            setError('Upload failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Resume Analyzer</h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Upload your Resume (PDF)</h2>
                <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-primary
                    hover:file:bg-indigo-100"
                    />
                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="flex items-center justify-center px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Analyzing...' : <><Upload className="w-4 h-4 mr-2" /> Analyze</>}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Results Section */}
            {analysis && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>
                            <span className={`px-4 py-1 rounded-full text-lg font-bold ${analysis.resumeScore > 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                Score: {analysis.resumeScore}/100
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-green-700 flex items-center mb-2"><CheckCircle className="w-5 h-5 mr-2" /> Strengths</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-600 flex items-center mb-2"><XCircle className="w-5 h-5 mr-2" /> Weaknesses / Missing</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;
