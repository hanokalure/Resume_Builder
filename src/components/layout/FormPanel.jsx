import { useState } from "react";
import BasicInfoForm from "../selections/BasicInfoForm";
import SummaryForm from "../selections/SummaryForm";
import SkillsSection from "../selections/SkillsSection";
import ProjectsSection from "../selections/ProjectsSection";
import CertificatesSection from "../selections/CertificatesSection";
import EducationSection from "../selections/EducationSection";
import ExperienceSection from "../selections/ExperienceSection";
import { generatePDF } from "../../utils/exportPDF";

import { useResume } from "../../context/ResumeContext";

// Accordion Component Helper
const AccordionSection = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="section-form">
      <div className="section-header" onClick={onToggle}>
        <h3>{title}</h3>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && <div className="section-body">{children}</div>}
    </div>
  );
};

const FormPanel = () => {
  const { state, dispatch } = useResume();
  const [openSection, setOpenSection] = useState("Basic Info");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="form-panel">
      {/* Sticky Header */}
      <div className="form-header-actions">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2>Resume Editor</h2>
        </div>

        <div className="action-buttons">
          <button onClick={generatePDF} className="btn-primary">Download PDF</button>

          <button onClick={() => dispatch({ type: "RESET_RESUME" })} className="btn-danger">Reset</button>
          <button onClick={() => dispatch({ type: "LOAD_DEMO_DATA" })} className="btn-secondary">Load Demo</button>
        </div>
      </div>

      <div className="form-content">
        <AccordionSection
          title="Basic Info"
          isOpen={openSection === "Basic Info"}
          onToggle={() => toggleSection("Basic Info")}
        >
          <BasicInfoForm />
        </AccordionSection>

        <AccordionSection
          title="Professional Summary"
          isOpen={openSection === "Summary"}
          onToggle={() => toggleSection("Summary")}
        >
          <SummaryForm />
        </AccordionSection>

        <AccordionSection
          title="Education"
          isOpen={openSection === "Education"}
          onToggle={() => toggleSection("Education")}
        >
          <EducationSection />
        </AccordionSection>

        <AccordionSection
          title="Skills"
          isOpen={openSection === "Skills"}
          onToggle={() => toggleSection("Skills")}
        >
          <SkillsSection />
        </AccordionSection>

        <AccordionSection
          title="Experience"
          isOpen={openSection === "Experience"}
          onToggle={() => toggleSection("Experience")}
        >
          <ExperienceSection />
        </AccordionSection>

        <AccordionSection
          title="Projects"
          isOpen={openSection === "Projects"}
          onToggle={() => toggleSection("Projects")}
        >
          <ProjectsSection />
        </AccordionSection>

        <AccordionSection
          title="Certificates"
          isOpen={openSection === "Certificates"}
          onToggle={() => toggleSection("Certificates")}
        >
          <CertificatesSection />
        </AccordionSection>
      </div>
    </div>
  );
};

export default FormPanel;
