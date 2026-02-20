import { useState } from "react";
import { useResume } from "../../context/ResumeContext";

const ExperienceSection = () => {
    const { state, dispatch } = useResume();
    const { experience } = state;

    const [newExp, setNewExp] = useState({
        id: null, // Track if editing
        company: "",
        role: "",
        duration: "",
        description: "",
    });

    const handleAddExp = () => {
        if (!newExp.company.trim()) return;

        if (newExp.id) {
            // Edit mode
            dispatch({ type: "UPDATE_EXPERIENCE", payload: newExp });
        } else {
            // Add mode
            const exp = {
                id: Date.now().toString(),
                ...newExp,
            };
            dispatch({ type: "ADD_EXPERIENCE", payload: exp });
        }

        setNewExp({ id: null, company: "", role: "", duration: "", description: "" });
    };

    const handleEdit = (exp) => {
        setNewExp(exp);
    };

    const handleDelete = (id) => {
        dispatch({ type: "DELETE_EXPERIENCE", payload: id });
    };

    return (
        <div>

            <div className="form-group">
                <input
                    type="text"
                    value={newExp.company}
                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                    placeholder="Company Name"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <input
                    type="text"
                    value={newExp.role}
                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                    placeholder="Role/Title"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <input
                    type="text"
                    value={newExp.duration}
                    onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                    placeholder="Duration (e.g. Jan 2020 - Present)"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <textarea
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    placeholder="Job Description (use bullets)"
                    rows="3"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <button onClick={handleAddExp} className="btn-add">
                    {newExp.id ? "Update Experience" : "Add Experience"}
                </button>
            </div>

            <hr />

            <div className="items-list">
                {experience.map((exp) => (
                    <div key={exp.id} className="item-card">
                        <div className="item-content">
                            <strong>{exp.company}</strong> - {exp.role}
                            <div><small>{exp.duration}</small></div>
                            <p style={{ fontSize: "12px", marginTop: "5px" }}>{exp.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleEdit(exp)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue' }}>✎</button>
                            <button onClick={() => handleDelete(exp.id)} className="btn-delete">×</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceSection;
