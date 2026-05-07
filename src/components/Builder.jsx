import { useState } from "react";
import FormPanel from "./layout/FormPanel";
import PreviewPanel from "./layout/PreviewPanel";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/layout.css";

const Builder = () => {
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' or 'preview'
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="app-container" style={{ flexDirection: 'column' }}>
      <header className="main-header">
        <div className="logo">Resume Builder</div>
        <div className="header-actions">
          <button className="header-btn" onClick={() => navigate('/profile')}>
            👤 Profile
          </button>
          <button className="header-btn danger" onClick={handleSignOut}>
            🚪 Logout
          </button>
        </div>
      </header>

      <div className="app-body">
        <div className={`panel-container ${activeTab === "editor" ? "active" : ""}`}>
          <FormPanel />
        </div>
        <div className={`panel-container ${activeTab === "preview" ? "active" : "preview-hidden-mobile"}`}>
          <PreviewPanel />
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <button 
          className={`nav-btn ${activeTab === "editor" ? "active" : ""}`}
          onClick={() => setActiveTab("editor")}
        >
          ✏️ Editor
        </button>
        <button 
          className={`nav-btn ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          📄 Preview
        </button>
      </nav>
    </div>
  );
};

export default Builder;
