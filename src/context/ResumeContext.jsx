import { createContext, useContext, useReducer, useEffect } from "react";

const ResumeContext = createContext(null);

const initialBasicState = {
  basicInfo: {
    name: "",
    email: "",
    emailText: "",
    phone: "",
    linkedin: "",
    linkedinText: "",
    github: "",
    githubText: "",
  },
  summary: "",
  role: "",
  masterSkills: [],
  selectedSkills: [],
  masterProjects: [],
  selectedProjects: [],
  masterCertificates: [],
  selectedCertificates: [],
  education: [],
  experience: [],
};

// Load from local storage or use initial state
const loadState = () => {
  const saved = localStorage.getItem("resumeData");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved resume data", e);
    }
  }
  return initialBasicState;
};

const resumeReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_BASIC_INFO":
      return {
        ...state,
        basicInfo: { ...state.basicInfo, ...action.payload },
      };
    case "UPDATE_SUMMARY":
      return {
        ...state,
        summary: action.payload,
      };
    case "SET_ROLE":
      return {
        ...state,
        role: action.payload,
      };
    case "ADD_SKILL":
      return {
        ...state,
        masterSkills: [...state.masterSkills, action.payload],
      };
    case "TOGGLE_SKILL": {
      const skill = action.payload;
      const isSelected = state.selectedSkills.some((s) => s.id === skill.id);
      return {
        ...state,
        selectedSkills: isSelected
          ? state.selectedSkills.filter((s) => s.id !== skill.id)
          : [...state.selectedSkills, skill],
      };
    }
    case "DELETE_MASTER_SKILL": {
      const skillId = action.payload;
      return {
        ...state,
        masterSkills: state.masterSkills.filter((s) => s.id !== skillId),
        selectedSkills: state.selectedSkills.filter((s) => s.id !== skillId),
      };
    }
    case "AUTO_FILTER_SKILLS": {
      const role = action.payload || state.role;
      if (!role || role === "Custom") return state;

      const filteredSkills = state.masterSkills.filter((skill) =>
        skill.tags.includes(role)
      );

      return {
        ...state,
        selectedSkills: filteredSkills,
      };
    }
    case "ADD_PROJECT":
      return {
        ...state,
        masterProjects: [...state.masterProjects, action.payload],
        selectedProjects: [...state.selectedProjects, action.payload],
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        masterProjects: state.masterProjects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        selectedProjects: state.selectedProjects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        masterProjects: state.masterProjects.filter((p) => p.id !== action.payload),
        selectedProjects: state.selectedProjects.filter((p) => p.id !== action.payload),
      };
    case "TOGGLE_PROJECT": {
      const project = action.payload;
      const isSelected = state.selectedProjects.some((p) => p.id === project.id);
      return {
        ...state,
        selectedProjects: isSelected
          ? state.selectedProjects.filter((p) => p.id !== project.id)
          : [...state.selectedProjects, project],
      };
    }
    case "AUTO_FILTER_PROJECTS": {
      const role = action.payload || state.role;
      if (!role || role === "Custom") return state;

      const filteredProjects = state.masterProjects.filter((project) =>
        project.tags.includes(role)
      );

      return {
        ...state,
        selectedProjects: filteredProjects,
      };
    }
    case "ADD_CERTIFICATE":
      return {
        ...state,
        masterCertificates: [...state.masterCertificates, action.payload],
        selectedCertificates: [...state.selectedCertificates, action.payload],
      };
    case "UPDATE_CERTIFICATE":
      return {
        ...state,
        masterCertificates: state.masterCertificates.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
        selectedCertificates: state.selectedCertificates.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "DELETE_CERTIFICATE":
      return {
        ...state,
        masterCertificates: state.masterCertificates.filter((c) => c.id !== action.payload),
        selectedCertificates: state.selectedCertificates.filter((c) => c.id !== action.payload),
      };
    case "TOGGLE_CERTIFICATE": {
      const cert = action.payload;
      const isSelected = state.selectedCertificates.some((c) => c.id === cert.id);
      return {
        ...state,
        selectedCertificates: isSelected
          ? state.selectedCertificates.filter((c) => c.id !== cert.id)
          : [...state.selectedCertificates, cert],
      };
    }
    case "ADD_EDUCATION":
      return {
        ...state,
        education: [...state.education, action.payload],
      };
    case "UPDATE_EDUCATION":
      return {
        ...state,
        education: state.education.map((edu) =>
          edu.id === action.payload.id ? action.payload : edu
        ),
      };
    case "DELETE_EDUCATION":
      return {
        ...state,
        education: state.education.filter((edu) => edu.id !== action.payload),
      };
    case "ADD_EXPERIENCE":
      return {
        ...state,
        experience: [...state.experience, action.payload],
      };
    case "UPDATE_EXPERIENCE":
      return {
        ...state,
        experience: state.experience.map((exp) =>
          exp.id === action.payload.id ? action.payload : exp
        ),
      };
    case "DELETE_EXPERIENCE":
      return {
        ...state,
        experience: state.experience.filter((exp) => exp.id !== action.payload),
      };
    case "RESET_RESUME":
      return initialBasicState;
    case "LOAD_DEMO_DATA":
      return {
        ...initialBasicState,
        basicInfo: {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          emailText: "Email Jane",
          phone: "+1 555 123 4567",
          linkedin: "https://linkedin.com/in/janesmith",
          linkedinText: "LinkedIn Profile",
          github: "https://github.com/janesmith",
          githubText: "GitHub Portfolio"
        },
        summary: "Highly motivated Full Stack Developer with 5+ years of experience designing and building scalable web applications. Proficient in React, Node.js, and cloud technologies. Proven track record of leading teams and delivering high-quality software solutions.",
        role: "",
        masterSkills: [
          { id: "1", name: "React", tags: ["Frontend Developer", "Full Stack Developer"] },
          { id: "2", name: "Node.js", tags: ["Backend Developer", "Full Stack Developer"] },
          { id: "3", name: "MongoDB", tags: ["Backend Developer", "Full Stack Developer"] },
          { id: "4", name: "Python", tags: ["Backend Developer", "Full Stack Developer"] },
          { id: "5", name: "AWS", tags: ["Full Stack Developer"] },
          { id: "6", name: "Docker", tags: ["Full Stack Developer"] }
        ],
        selectedSkills: [
          { id: "1", name: "React", tags: ["Frontend Developer", "Full Stack Developer"] },
          { id: "2", name: "Node.js", tags: ["Backend Developer", "Full Stack Developer"] },
          { id: "3", name: "MongoDB", tags: ["Backend Developer", "Full Stack Developer"] },
          { id: "4", name: "Python", tags: ["Backend Developer", "Full Stack Developer"] },
          { id: "5", name: "AWS", tags: ["Full Stack Developer"] },
          { id: "6", name: "Docker", tags: ["Full Stack Developer"] }
        ],
        education: [
          { id: "1", institution: "Tech University", degree: "M.S. Computer Science", year: "2020", gpa: "3.9", gradeType: "CGPA" },
          { id: "2", institution: "State College", degree: "B.S. Information Technology", year: "2018", gpa: "3.7", gradeType: "CGPA" }
        ],
        experience: [
          { id: "1", company: "Tech Solutions Inc.", role: "Senior Developer", duration: "2022 - Present", description: "• Led a team of 5 developers in re-architecting the legacy monolith to microservices.\n• Improved application performance by 40% through code optimization and caching strategies.\n• Mentored junior developers and conducted code reviews." },
          { id: "2", company: "WebCorp", role: "Software Engineer", duration: "2018 - 2022", description: "• Developed and maintained multiple React-based web applications.\n• Collaborated with UX/UI designers to implement responsive and accessible interfaces.\n• Integrated third-party APIs for payment processing and data analytics." }
        ],
        masterProjects: [
          { id: '1', title: 'Resume Builder - Markdown & PDF Generator | Live Application', description: 'Architected a responsive resume creation tool using React.js and Vite, featuring real-time preview and ATS-optimized PDF export via html2pdf.js. Implemented complex state management with Context API for dynamic form handling, mobile-first responsive design, and local storage persistence for seamless user experience.', tags: ['Frontend Developer', 'Full Stack Developer'] },
          { id: '2', title: 'Task Manager App', description: 'Developed a real-time task management tool with WebSocket updates.', tags: ['Frontend Developer'] }
        ],
        selectedProjects: [
          { id: '1', title: 'Resume Builder - Markdown & PDF Generator | Live Application', description: 'Architected a responsive resume creation tool using React.js and Vite, featuring real-time preview and ATS-optimized PDF export via html2pdf.js. Implemented complex state management with Context API for dynamic form handling, mobile-first responsive design, and local storage persistence for seamless user experience.', tags: ['Frontend Developer', 'Full Stack Developer'] },
          { id: '2', title: 'Task Manager App', description: 'Developed a real-time task management tool with WebSocket updates.', tags: ['Frontend Developer'] }
        ],
        masterCertificates: [
          { id: '1', name: 'AWS Certified Solutions Architect', url: 'https://aws.amazon.com/certification/' },
          { id: '2', name: 'Meta Front-End Developer', url: '' }
        ],
        selectedCertificates: [
          { id: '1', name: 'AWS Certified Solutions Architect', url: 'https://aws.amazon.com/certification/' },
          { id: '2', name: 'Meta Front-End Developer', url: '' }
        ]
      };
    default:
      return state;
  }
};

export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, loadState());

  // Save to local storage on state change
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(state));
  }, [state]);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
