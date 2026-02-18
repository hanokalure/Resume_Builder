import FormPanel from "./components/layout/FormPanel";
import PreviewPanel from "./components/layout/PreviewPanel";
import "./styles/layout.css";

function App() {
  return (
    <div className="app-container">
      <FormPanel />
      <PreviewPanel />
    </div>
  );
}

export default App;
