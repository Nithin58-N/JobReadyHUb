import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CareerGoal from './pages/CareerGoal';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import SkillSuggestions from './pages/SkillSuggestions';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Landing />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="career-goal" element={<CareerGoal />} />
                        <Route path="resume" element={<ResumeAnalyzer />} />
                        <Route path="interview" element={<MockInterview />} />
                        <Route path="skills" element={<SkillSuggestions />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
