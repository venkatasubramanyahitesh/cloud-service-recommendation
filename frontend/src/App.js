import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./Login";
import RegisterPage from "./Register";

// ─── Auth Helpers (exported so Login/Register can import) ─────────────────────

export function getAuth() {
  const email = localStorage.getItem("auth_email");
  const password = localStorage.getItem("auth_password");
  return email && password ? { email, password } : null;
}

export function basicAuthHeader(email, password) {
  return "Basic " + btoa(`${email}:${password}`);
}

function ProtectedRoute({ children }) {
  return getAuth() ? children : <Navigate to="/login" replace />;
}

// ─── Shared AppShell ──────────────────────────────────────────────────────────

export function AppShell({ children }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_email");
    localStorage.removeItem("auth_password");
    navigate("/login");
  };

  return (
    <div className="app">
      <div className="grid-bg" />
      <div className="noise-overlay" />

      <header className="header">
        <Link to="/" className="logo-link">
          <div className="logo-cluster">
            <div className="logo-icon">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 4L32 12V24L18 32L4 24V12L18 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M18 4L18 32M4 12L32 12M4 24L32 24" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.4"/>
                <circle cx="18" cy="18" r="4" fill="currentColor" opacity="0.9"/>
                <circle cx="18" cy="4" r="2" fill="currentColor"/>
                <circle cx="32" cy="12" r="2" fill="currentColor"/>
                <circle cx="32" cy="24" r="2" fill="currentColor"/>
                <circle cx="18" cy="32" r="2" fill="currentColor"/>
                <circle cx="4"  cy="24" r="2" fill="currentColor"/>
                <circle cx="4"  cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-label">AWS</span>
              <span className="logo-divider">|</span>
              <span className="logo-sub">Recommendation Engine</span>
            </div>
          </div>
        </Link>

        <div className="header-right">
          {auth ? (
            <div className="auth-cluster">
              <span className="auth-email">{auth.email}</span>
              <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
            </div>
          ) : (
            <div className="auth-cluster">
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link nav-link--primary" to="/register">Register</Link>
            </div>
          )}
          <div className="status-badge">
            <span className="status-dot" />
            AI ONLINE
          </div>
        </div>
      </header>

      {children}

      <footer className="footer">
        <span>AI Cloud Service Recommendation Platform</span>
        <span className="footer-sep">·</span>
        <span>Powered by AWS & Generative AI</span>
      </footer>
    </div>
  );
}

// ─── AWS Icons + Response Parser ──────────────────────────────────────────────

const AWS_ICONS = {
  EC2: "🖥️", S3: "🪣", Lambda: "λ", RDS: "🗄️", DynamoDB: "⚡",
  CloudFront: "🌐", ECS: "🐳", EKS: "☸️", SQS: "📨", SNS: "📣",
  API: "🔗", VPC: "🔒", IAM: "🛡️", CloudWatch: "📊", Bedrock: "🧠",
  SageMaker: "🤖", Glue: "🔧", Athena: "🔍", Redshift: "🏭", EMR: "📈",
  Kinesis: "🌊", Step: "🪜", EventBridge: "🎯", AppSync: "🔄", Amplify: "🚀",
};

function getIcon(line) {
  for (const [key, icon] of Object.entries(AWS_ICONS)) {
    if (line.includes(key)) return icon;
  }
  return "☁️";
}

function parseRecommendation(text) {
  if (!text) return [];
  const lines = text.split("\n").filter((l) => l.trim());
  const bullets = [];
  let currentSection = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const isBullet = /^[-•*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed);
    const isHeader =
      trimmed.endsWith(":") ||
      /^#+\s/.test(trimmed) ||
      (trimmed === trimmed.toUpperCase() && trimmed.length > 3);
    if (isHeader) {
      currentSection = trimmed.replace(/^#+\s*/, "").replace(/:$/, "");
      bullets.push({ type: "header", text: currentSection });
    } else if (isBullet) {
      const content = trimmed.replace(/^[-•*]\s+/, "").replace(/^\d+\.\s+/, "");
      bullets.push({ type: "bullet", text: content, icon: getIcon(content), section: currentSection });
    } else {
      bullets.push({ type: "prose", text: trimmed, section: currentSection });
    }
  }
  return bullets;
}

const PLACEHOLDERS = [
  "e.g. I need to build a real-time analytics pipeline for 10M daily events...",
  "e.g. My startup needs a scalable image processing backend with ML inference...",
  "e.g. We want to migrate a monolithic app to microservices with auto-scaling...",
  "e.g. Need a serverless API that handles variable traffic spikes efficiently...",
];

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage() {
  const [problem, setProblem]           = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charCount, setCharCount]       = useState(0);
  const [animateResult, setAnimateResult] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length), 3500);
    return () => clearInterval(id);
  }, []);

  const handleInput = (e) => {
    setProblem(e.target.value);
    setCharCount(e.target.value.length);
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (!problem.trim()) { setError("Please describe your problem or use case first."); return; }
    setLoading(true); setError(null); setRecommendation(null); setAnimateResult(false);
    try{
    const email = localStorage.getItem("email");
const password = localStorage.getItem("password");

const res = await fetch("http://localhost:8080/api/recommend", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Basic " + btoa(`${email}:${password}`)
  },
  body: JSON.stringify({ problem: problem.trim() })
});
      if (!res.ok) { const t = await res.text(); throw new Error(t || `Server error: ${res.status}`); }
      const data = await res.json();
      setRecommendation(formatResponse(data));
      setTimeout(() => setAnimateResult(true), 50);
    } catch (err) {
      console.error("REAL ERROR:", err);
setError(err.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit(); };
  const parsedItems = parseRecommendation(recommendation);
  const formatResponse = (data) => {
  let output = "";

  

  if (data.aws) {
    output += "☁️ AWS Services:\n";
    data.aws.forEach(s => output += `• ${s}\n`);
    output += "\n";
  }

  if (data.azure) {
    output += "🔷 Azure Services:\n";
    data.azure.forEach(s => output += `• ${s}\n`);
    output += "\n";
  }

  if (data.gcp) {
    output += "🟢 GCP Services:\n";
    data.gcp.forEach(s => output += `• ${s}\n`);
    output += "\n";
  }

  if (data.cost) {
    output += "💰 Estimated Cost:\n";
    Object.entries(data.cost).forEach(([k, v]) => {
      output += `• ${k.toUpperCase()}: $${v}\n`;
    });
  }

  if (data.best) {
    output += `🔥 Best Provider: ${data.best}\n\n`;
  }

  return output;

};

  return (
    <main className="main">
      <div className="hero">
        <p className="hero-eyebrow">Powered by Generative AI</p>
        <h1 className="hero-title">
          AI Cloud Service<br />
          <span className="hero-accent">Recommendation</span> Platform
        </h1>
        <p className="hero-desc">
          Describe your architecture challenge. Get precise AWS service recommendations
          tailored to your use case, scale, and constraints.
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-tag">INPUT</span>
          <span className="card-hint">Ctrl+Enter to submit</span>
        </div>

        <div className="textarea-wrapper">
          <textarea
            className={`textarea ${problem ? "has-content" : ""}`}
            value={problem}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            rows={5}
            maxLength={2000}
            disabled={loading}
          />
          <div className="textarea-footer">
            <span className="char-count">{charCount} / 2000</span>
            {problem && (
              <button className="clear-btn" onClick={() => { setProblem(""); setCharCount(0); setError(null); }}>
                Clear
              </button>
            )}
          </div>
        </div>

        <button
          className={`submit-btn ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading || !problem.trim()}
        >
          {loading ? (
            <><span className="spinner" />Analyzing...</>
          ) : (
            <>
              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Get Recommendation
            </>
          )}
        </button>

        {error && (
          <div className="error-box">
            <svg viewBox="0 0 20 20" fill="currentColor" className="error-icon">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div><strong>Error</strong><p>{error}</p></div>
          </div>
        )}
      </div>

      {(recommendation || loading) && (
        <div className={`result-card ${animateResult ? "visible" : ""}`}>
          <div className="result-header">
            <span className="card-tag result-tag">RECOMMENDATION</span>
            <div className="result-meta">
              <span className="result-count">
                {parsedItems.filter((i) => i.type === "bullet").length} services identified
              </span>
            </div>
          </div>

          {loading && !recommendation && (
            <div className="skeleton-wrapper">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton-line"
                  style={{ width: `${75 + Math.random() * 20}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}

          {parsedItems.length > 0 && (
            <div className="result-body">
              {parsedItems.map((item, idx) => {
                if (item.type === "header")
                  return <h3 key={idx} className="result-section-title" style={{ animationDelay: `${idx * 0.05}s` }}>{item.text}</h3>;
                if (item.type === "bullet")
                  return (
                    <div key={idx} className="result-bullet" style={{ animationDelay: `${idx * 0.06}s` }}>
                      <span className="bullet-icon">{item.icon}</span>
                      <span className="bullet-text">{item.text}</span>
                    </div>
                  );
                return <p key={idx} className="result-prose" style={{ animationDelay: `${idx * 0.04}s` }}>{item.text}</p>;
              })}
            </div>
          )}

          {recommendation && parsedItems.length === 0 && <pre className="result-raw">{recommendation}</pre>}
        </div>
      )}
    </main>
  );
}

// ─── Router Root ──────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<AppShell><LoginPage /></AppShell>} />
        <Route path="/register" element={<AppShell><RegisterPage /></AppShell>} />
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell><HomePage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
