import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { ClaimWorkflow } from './pages/ClaimWorkflow';
import { initialClaims } from './data/mockClaims';

function App() {
  const [claims, setClaims] = useState(initialClaims);
  const [role, setRole] = useState('agent'); // 'agent' or 'adjuster'

  const handleUpdateClaim = useCallback((updatedClaim) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === updatedClaim.id ? updatedClaim : c))
    );
  }, []);

  const handleAddClaim = useCallback((newClaim) => {
    setClaims((prev) => [newClaim, ...prev]);
  }, []);

  return (
    <Router>
      <div className="app-layout">
        <header className="app-header">
          <Link to="/" className="app-logo">
            <div className="app-logo-icon">🛡️</div>
            <span>ClaimsAI</span>
          </Link>
          <div className="app-header-right">
            <div className="role-toggle">
              <button
                className={`role-toggle-btn ${role === 'agent' ? 'active' : ''}`}
                onClick={() => setRole('agent')}
              >
                Claims Agent
              </button>
              <button
                className={`role-toggle-btn ${role === 'adjuster' ? 'active' : ''}`}
                onClick={() => setRole('adjuster')}
              >
                Sr. Adjuster
              </button>
            </div>
            <div className="app-header-user">
              <div className="user-avatar">
                {role === 'agent' ? 'CA' : 'SA'}
              </div>
              <span>{role === 'agent' ? 'Agent Martinez' : 'Sr. Adjuster Williams'}</span>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={<Dashboard claims={claims} onAddClaim={handleAddClaim} />}
            />
            <Route
              path="/claim/:id"
              element={
                <ClaimWorkflow
                  claims={claims}
                  onUpdateClaim={handleUpdateClaim}
                  role={role}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
