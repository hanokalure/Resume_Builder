import { useState } from "react";
import { useResume } from "../../context/ResumeContext";

const SkillsSection = () => {
    const { state, dispatch } = useResume();
    const { masterSkills, selectedSkills, role } = state;

    const [newSkill, setNewSkill] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);

    const predefinedRoles = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer"
    ];

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;

        const skill = {
            id: Date.now().toString(),
            name: newSkill,
            tags: selectedTags.length > 0 ? selectedTags : ["General"], // Default tag
        };

        dispatch({ type: "ADD_SKILL", payload: skill });
        setNewSkill("");
        setSelectedTags([]);
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleToggleSelection = (skill) => {
        dispatch({ type: "TOGGLE_SKILL", payload: skill });
    };

    const handleDeleteMasterSkill = (id) => {
        if (window.confirm("Delete this skill from master list?")) {
            dispatch({ type: "DELETE_MASTER_SKILL", payload: id });
        }
    };

    return (
        <div className="section-form">
            <h3>Skills</h3>

            {/* Add New Skill */}
            <div className="add-skill-form">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="New Skill (e.g. React)"
                    className="skill-input"
                />
                <div className="tags-selector">
                    <small>Assign Tags:</small>
                    <div className="tag-options">
                        {predefinedRoles.map(role => (
                            <label key={role} className="tag-label">
                                <input
                                    type="checkbox"
                                    checked={selectedTags.includes(role)}
                                    onChange={() => toggleTag(role)}
                                />
                                {role.replace(" Developer", "")}
                            </label>
                        ))}
                    </div>
                </div>
                <button onClick={handleAddSkill} className="btn-add">Add to Master List</button>
            </div>

            <hr />

            {/* Master List */}
            <h4>Master List {role && <small>(Auto-filtered for: {role})</small>}</h4>
            <div className="skills-list">
                {masterSkills.length === 0 && <p className="text-muted">No skills added yet.</p>}
                {masterSkills.map(skill => {
                    const isSelected = selectedSkills.some(s => s.id === skill.id);
                    return (
                        <div key={skill.id} className={`skill-item ${isSelected ? "selected" : ""}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ flex: 1 }}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelection(skill)}
                                />
                                <span className="skill-name">{skill.name}</span>
                                <span style={{ marginLeft: "10px" }}>
                                    {skill.tags.map(tag => (
                                        <span key={tag} className="tag-badge" style={{ fontSize: "10px", padding: "2px 5px", background: "#eee", borderRadius: "4px", marginRight: "3px" }}>{tag.replace(" Developer", "")}</span>
                                    ))}
                                </span>
                            </label>
                            <button
                                onClick={() => handleDeleteMasterSkill(skill.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontSize: '16px', padding: '0 5px' }}
                                title="Remove from Master List"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsSection;
