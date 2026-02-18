import { useState } from "react";
import { useResume } from "../../context/ResumeContext";

const EducationSection = () => {
    const { state, dispatch } = useResume();
    const { education } = state;

    const [newEdu, setNewEdu] = useState({
        id: null,
        institution: "",
        degree: "",
        year: "",
        gpa: "",
        gradeType: "CGPA",
    });

    const handleAddEdu = () => {
        if (!newEdu.institution.trim()) return;

        if (newEdu.id) {
            // Update
            dispatch({ type: "UPDATE_EDUCATION", payload: newEdu });
        } else {
            // Add
            const edu = {
                id: Date.now().toString(),
                ...newEdu,
            };
            dispatch({ type: "ADD_EDUCATION", payload: edu });
        }
        setNewEdu({ id: null, institution: "", degree: "", year: "", gpa: "", gradeType: "CGPA" });
    };

    const handleEdit = (edu) => {
        setNewEdu(edu);
    };

    const handleDelete = (id) => {
        dispatch({ type: "DELETE_EDUCATION", payload: id });
    };

    return (
        <div className="section-form">
            <h3>Education</h3>

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

                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "5px" }}>
                    <div style={{ display: "flex", gap: "5px" }}>
                        <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "2px" }}>
                            <input
                                type="radio"
                                name="gradeType"
                                value="CGPA"
                                checked={newEdu.gradeType === "CGPA"}
                                onChange={(e) => setNewEdu({ ...newEdu, gradeType: e.target.value })}
                            /> CGPA
                        </label>
                        <label style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "2px" }}>
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
                        style={{ flex: 1 }}
                    />
                </div>

                <button onClick={handleAddEdu} className="btn-add">
                    {newEdu.id ? "Update Education" : "Add Education"}
                </button>
            </div>

            <hr />

            <div className="items-list">
                {education.map((edu) => (
                    <div key={edu.id} className="item-card">
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
