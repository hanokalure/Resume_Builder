import { useState, useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const EducationSection = () => {
    const { state, dispatch } = useResume();
    const { education } = state;
    const { user } = useAuth();

    const [newEdu, setNewEdu] = useState({
        id: null,
        institution: "",
        degree: "",
        year: "",
        gpa: "",
        gradeType: "CGPA",
    });

    const [profileEdu, setProfileEdu] = useState([]);
    const [selectedProfileEduIndex, setSelectedProfileEduIndex] = useState("");

    useEffect(() => {
        if (user) {
            const fetchProfileEdu = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('education')
                    .eq('id', user.id)
                    .single();
                if (data && data.education) {
                    setProfileEdu(data.education);
                }
            };
            fetchProfileEdu();
        }
    }, [user]);

    const handleAddEdu = () => {
        if (!newEdu.institution.trim()) return;

        if (newEdu.id) {
            dispatch({ type: "UPDATE_EDUCATION", payload: newEdu });
        } else {
            const edu = {
                id: Date.now().toString(),
                ...newEdu,
            };
            dispatch({ type: "ADD_EDUCATION", payload: edu });
        }
        setNewEdu({ id: null, institution: "", degree: "", year: "", gpa: "", gradeType: "CGPA" });
    };

    const handleAddFromProfile = () => {
        if (selectedProfileEduIndex === "") return;
        const edu = profileEdu[selectedProfileEduIndex];
        
        // Check if already in resume
        if (!education.some(e => e.institution === edu.institution && e.degree === edu.degree)) {
            const newEduEntry = {
                id: Date.now().toString(),
                ...edu,
            };
            dispatch({ type: "ADD_EDUCATION", payload: newEduEntry });
        }
        setSelectedProfileEduIndex("");
    };

    const handleEdit = (edu) => {
        setNewEdu(edu);
    };

    const handleDelete = (id) => {
        dispatch({ type: "DELETE_EDUCATION", payload: id });
    };

    return (
        <div>
            {profileEdu.length > 0 && (
                <div className="add-skill-form" style={{ marginBottom: '15px', background: '#f8fafc', padding: '10px', borderRadius: '5px' }}>
                    <small style={{ display: 'block', marginBottom: '5px' }}>Add from Your Profile:</small>
                    <div className="profile-import-group">
                        <select 
                            value={selectedProfileEduIndex} 
                            onChange={(e) => setSelectedProfileEduIndex(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                        >
                            <option value="">-- Select Education --</option>
                            {profileEdu.map((edu, index) => (
                                <option key={index} value={index}>{edu.institution} - {edu.degree}</option>
                            ))}
                        </select>
                        <button onClick={handleAddFromProfile} className="btn-add" disabled={selectedProfileEduIndex === ""}>
                            Add
                        </button>
                    </div>
                </div>
            )}

            <div className="form-group">
                <input
                    type="text"
                    value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    placeholder="Institution"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <input
                    type="text"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    placeholder="Degree"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        value={newEdu.year}
                        onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                        placeholder="Year"
                        style={{ marginBottom: "5px", flex: 1 }}
                    />
                </div>

                <div className="form-row-split" style={{ alignItems: "center", marginBottom: "5px" }}>
                    <div style={{ display: "flex", gap: "15px", flexShrink: 0 }}>
                        <label style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="gradeType"
                                value="CGPA"
                                checked={newEdu.gradeType === "CGPA"}
                                onChange={(e) => setNewEdu({ ...newEdu, gradeType: e.target.value })}
                            /> CGPA
                        </label>
                        <label style={{ fontSize: "14px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="gradeType"
                                value="Percentage"
                                checked={newEdu.gradeType === "Percentage"}
                                onChange={(e) => setNewEdu({ ...newEdu, gradeType: e.target.value })}
                            /> %
                        </label>
                    </div>
                    <input
                        type="text"
                        value={newEdu.gpa}
                        onChange={(e) => setNewEdu({ ...newEdu, gpa: e.target.value })}
                        placeholder={newEdu.gradeType === "CGPA" ? "e.g. 8.5" : "e.g. 85%"}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                </div>

                <button onClick={handleAddEdu} className="btn-add">
                    {newEdu.id ? "Update Education" : "Add Education"}
                </button>
            </div>

            <hr />

            <div className="items-list">
                {education.map((edu, index) => (
                    <div key={edu.id || index} className="item-card">
                        <div className="item-content">
                            <strong>{edu.institution}</strong>
                            <div>{edu.degree}</div>
                            <small>{edu.year} {edu.gpa && `| ${edu.gradeType}: ${edu.gpa}`}</small>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleEdit(edu)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue' }}>✎</button>
                            <button onClick={() => handleDelete(edu.id)} className="btn-delete">×</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationSection;
