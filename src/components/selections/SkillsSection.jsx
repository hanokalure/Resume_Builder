import { useState, useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const SkillsSection = () => {
    const { state, dispatch } = useResume();
    const { masterSkills, selectedSkills, role } = state;
    const { user } = useAuth();

    const [newSkill, setNewSkill] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [profileSkills, setProfileSkills] = useState([]);
    const [selectedProfileSkill, setSelectedProfileSkill] = useState("");

    const predefinedRoles = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer"
    ];

    useEffect(() => {
        if (user) {
            const fetchProfileSkills = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('skills')
                    .eq('id', user.id)
                    .single();
                if (data && data.skills) {
                    setProfileSkills(data.skills);
                }
            };
            fetchProfileSkills();
        }
    }, [user]);

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

    const handleAddFromProfile = () => {
        if (!selectedProfileSkill) return;
        
        // Prevent duplicate in masterSkills
        if (!masterSkills.some(s => s.name === selectedProfileSkill)) {
            const skill = {
                id: Date.now().toString(),
                name: selectedProfileSkill,
                tags: ["General"],
            };
            dispatch({ type: "ADD_SKILL", payload: skill });
            // Automatically select it too
            dispatch({ type: "TOGGLE_SKILL", payload: skill });
        }
        setSelectedProfileSkill("");
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
        <div>
            {/* Add from Profile Dropdown */}
            {profileSkills.length > 0 && (
                <div className="add-skill-form" style={{ marginBottom: '15px', background: '#f8fafc', padding: '10px', borderRadius: '5px' }}>
                    <small style={{ display: 'block', marginBottom: '5px' }}>Add from Your Profile:</small>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select 
                            value={selectedProfileSkill} 
                            onChange={(e) => setSelectedProfileSkill(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Select a skill --</option>
                            {profileSkills.map(skill => (
                                <option key={skill} value={skill}>{skill}</option>
                            ))}
                        </select>
                        <button onClick={handleAddFromProfile} className="btn-add" disabled={!selectedProfileSkill}>
                            Add
                        </button>
                    </div>
                </div>
            )}

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
                {masterSkills.map((skill, index) => {
                    const isSelected = selectedSkills.some(s => s.id === skill.id);
                    return (
                        <div key={skill.id || index} className={`skill-item ${isSelected ? "selected" : ""}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
