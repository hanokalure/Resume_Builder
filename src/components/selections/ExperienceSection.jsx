import { useState, useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const ExperienceSection = () => {
    const { state, dispatch } = useResume();
    const { experience } = state;
    const { user } = useAuth();

    const [newExp, setNewExp] = useState({
        id: null,
        company: "",
        role: "",
        duration: "",
        description: "",
    });

    const [profileExp, setProfileExp] = useState([]);
    const [selectedProfileExpIndex, setSelectedProfileExpIndex] = useState("");

    useEffect(() => {
        if (user) {
            const fetchProfileExp = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('experience')
                    .eq('id', user.id)
                    .single();
                if (data && data.experience) {
                    setProfileExp(data.experience);
                }
            };
            fetchProfileExp();
        }
    }, [user]);

    const handleAddExp = () => {
        if (!newExp.company.trim()) return;

        if (newExp.id) {
            dispatch({ type: "UPDATE_EXPERIENCE", payload: newExp });
        } else {
            const exp = {
                id: Date.now().toString(),
                ...newExp,
            };
            dispatch({ type: "ADD_EXPERIENCE", payload: exp });
        }

        setNewExp({ id: null, company: "", role: "", duration: "", description: "" });
    };

    const handleAddFromProfile = () => {
        if (selectedProfileExpIndex === "") return;
        const exp = profileExp[selectedProfileExpIndex];
        
        if (!experience.some(e => e.company === exp.company && e.role === exp.role)) {
            const newExpEntry = {
                id: Date.now().toString(),
                ...exp,
            };
            dispatch({ type: "ADD_EXPERIENCE", payload: newExpEntry });
        }
        setSelectedProfileExpIndex("");
    };

    const handleEdit = (exp) => {
        setNewExp(exp);
    };

    const handleDelete = (id) => {
        dispatch({ type: "DELETE_EXPERIENCE", payload: id });
    };

    return (
        <div>
            {profileExp.length > 0 && (
                <div className="add-skill-form" style={{ marginBottom: '15px', background: '#f8fafc', padding: '10px', borderRadius: '5px' }}>
                    <small style={{ display: 'block', marginBottom: '5px' }}>Add from Your Profile:</small>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select 
                            value={selectedProfileExpIndex} 
                            onChange={(e) => setSelectedProfileExpIndex(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Select Experience --</option>
                            {profileExp.map((exp, index) => (
                                <option key={index} value={index}>{exp.company} - {exp.role}</option>
                            ))}
                        </select>
                        <button onClick={handleAddFromProfile} className="btn-add" disabled={selectedProfileExpIndex === ""}>
                            Add
                        </button>
                    </div>
                </div>
            )}

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
                {experience.map((exp, index) => (
                    <div key={exp.id || index} className="item-card">
                        <div className="item-content">
                            <strong>{exp.company}</strong> - {exp.role}
                            <div><small>{exp.duration}</small></div>
                            <p style={{ fontSize: "12px", marginTop: "5px", whiteSpace: "pre-line" }}>{exp.description}</p>
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
