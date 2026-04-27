import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';
import IssueDetailsPage from './pages/IssueDetailsPage';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * Main App component with routing and global providers
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<motion.div key="home" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.25 }}><Home /></motion.div>} />
              <Route path="/report" element={<motion.div key="report" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.25 }}><ReportIssue /></motion.div>} />
              <Route path="/my-issues" element={<motion.div key="my-issues" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.25 }}><MyIssues /></motion.div>} />
              <Route path="/issues/:id" element={<motion.div key="issue-details" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.25 }}><IssueDetailsPage /></motion.div>} />
              <Route path="/login" element={<motion.div key="login" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.25 }}><Login /></motion.div>} />
              <Route path="/register" element={<motion.div key="register" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.25 }}><Register /></motion.div>} />
            </Routes>
          </AnimatePresence>
        </Layout>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(15, 23, 42, 0.92)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              backdropFilter: 'blur(16px)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
