import { useState } from "react";
import FormPanel from "./components/layout/FormPanel";
import PreviewPanel from "./components/layout/PreviewPanel";
import "./styles/layout.css";


function App() {
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' or 'preview'

  return (
    <div className="app-container">
      <div className={`panel-container ${activeTab === "editor" ? "active" : ""}`}>
        <FormPanel />
      </div>
      <div className={`panel-container ${activeTab === "preview" ? "active" : "preview-hidden-mobile"}`}>
        <PreviewPanel />
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
}

export default App;
