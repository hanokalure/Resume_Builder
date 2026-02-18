import { useResume } from "../../context/ResumeContext";
import "../../styles/resume.css";

// Simple Inline SVG Icons
const MailIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const PhoneIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const LinkedinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const GithubIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const ResumeTemplate = () => {
    const { state } = useResume();
    const { basicInfo, summary, selectedSkills, education, experience, selectedProjects, selectedCertificates } = state;

    return (
        <div className="resume-template">
            {/* Header Section */}
            <header className="resume-header">
                <h1>{basicInfo.name || "YOUR NAME"}</h1>
                {state.role && <p className="resume-role">{state.role}</p>}
                <div className="contact-info">
                    {basicInfo.email && (
                        <>
                            <a href={`mailto:${basicInfo.email}`} className="contact-link">
                                <MailIcon /> {basicInfo.emailText || basicInfo.email}
                            </a>
                            {(basicInfo.phone || basicInfo.linkedin || basicInfo.github) && <span className="separator">|</span>}
                        </>
                    )}

                    {basicInfo.phone && (
                        <>
                            <a href={`tel:${basicInfo.phone}`} className="contact-link">
                                <PhoneIcon /> {basicInfo.phone}
                            </a>
                            {(basicInfo.linkedin || basicInfo.github) && <span className="separator">|</span>}
                        </>
                    )}

                    {basicInfo.linkedin && (
                        <>
                            <a href={basicInfo.linkedin.startsWith('http') ? basicInfo.linkedin : `https://${basicInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                                <LinkedinIcon /> {basicInfo.linkedinText || basicInfo.linkedin.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                            </a>
                            {basicInfo.github && <span className="separator">|</span>}
                        </>
                    )}

                    {basicInfo.github && (
                        <a href={basicInfo.github.startsWith('http') ? basicInfo.github : `https://${basicInfo.github}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                            <GithubIcon /> {basicInfo.githubText || basicInfo.github.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                        </a>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {summary && (
                <section className="resume-section">
                    <h3>Professional Summary</h3>
                    <p>{summary}</p>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="resume-section">
                    <h3>Education</h3>
                    {education.map(edu => (
                        <div key={edu.id} className="resume-item">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <strong>{edu.institution}</strong>
                                <span>{edu.year}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>{edu.degree}</span>
                                {edu.gpa && <span>{edu.gradeType === "Percentage" ? "Percentage" : "CGPA"}: {edu.gpa}</span>}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {selectedSkills.length > 0 && (
                <section className="resume-section">
                    <h3>Skills</h3>
                    <ul className="skills-grid">
                        {selectedSkills.map(skill => (
                            <li key={skill.id}>{skill.name}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="resume-section">
                    <h3>Experience</h3>
                    {experience.map(exp => (
                        <div key={exp.id} className="resume-item">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <strong>{exp.company}</strong>
                                <span>{exp.duration}</span>
                            </div>
                            <div style={{ fontStyle: "italic", marginBottom: "5px" }}>{exp.role}</div>
                            <p style={{ whiteSpace: "pre-wrap" }}>{exp.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {/* Projects */}
            {selectedProjects.length > 0 && (
                <section className="resume-section">
                    <h3>Projects</h3>
                    {selectedProjects.map(project => (
                        <div key={project.id} className="resume-item">
                            <strong>{project.title}</strong>
                            <p>{project.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {/* Certificates */}
            {selectedCertificates.length > 0 && (
                <section className="resume-section">
                    <h3>Certifications</h3>
                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                        {selectedCertificates.map(cert => (
                            <li key={cert.id} style={{ marginBottom: "5px" }}>
                                {cert.url ? (
                                    <a href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`} target="_blank" rel="noopener noreferrer" style={{ color: "black", textDecoration: "none" }}>
                                        <strong>{cert.name}</strong>
                                    </a>
                                ) : (
                                    <strong>{cert.name}</strong>
                                )}
                                - {cert.issuer} ({cert.year})
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default ResumeTemplate;
