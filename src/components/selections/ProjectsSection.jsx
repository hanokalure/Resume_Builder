import { useState, useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const ProjectsSection = () => {
    const { state, dispatch } = useResume();
    const { masterProjects, selectedProjects, role } = state;
    const { user } = useAuth();

    const [newProject, setNewProject] = useState({
        id: null,
        title: "",
        description: "",
    });
    const [selectedTags, setSelectedTags] = useState([]);
    
    const [profileProjects, setProfileProjects] = useState([]);
    const [selectedProfileProjIndex, setSelectedProfileProjIndex] = useState("");

    const predefinedRoles = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
    ];

    useEffect(() => {
        if (user) {
            const fetchProfileProjects = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('projects')
                    .eq('id', user.id)
                    .single();
                if (data && data.projects) {
                    setProfileProjects(data.projects);
                }
            };
            fetchProfileProjects();
        }
    }, [user]);

    const handleAddProject = () => {
        if (!newProject.title.trim()) return;

        if (newProject.id) {
            const updatedProject = { ...newProject, tags: selectedTags };
            dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
        } else {
            const project = {
                ...newProject,
                id: Date.now().toString(),
                tags: selectedTags.length > 0 ? selectedTags : ["General"],
            };
            dispatch({ type: "ADD_PROJECT", payload: project });
        }

        setNewProject({ id: null, title: "", description: "" });
        setSelectedTags([]);
    };

    const handleAddFromProfile = () => {
        if (selectedProfileProjIndex === "") return;
        const proj = profileProjects[selectedProfileProjIndex];
        
        if (!masterProjects.some(p => p.title === proj.title)) {
            const newProjEntry = {
                ...proj,
                id: Date.now().toString(),
                tags: proj.tags && proj.tags.length > 0 ? proj.tags : ["General"]
            };
            dispatch({ type: "ADD_PROJECT", payload: newProjEntry });
            dispatch({ type: "TOGGLE_PROJECT", payload: newProjEntry });
        }
        setSelectedProfileProjIndex("");
    };

    const handleEdit = (project) => {
        setNewProject(project);
        setSelectedTags(project.tags || []);
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleToggleSelection = (project) => {
        dispatch({ type: "TOGGLE_PROJECT", payload: project });
    };

    const handleDelete = (id) => {
        dispatch({ type: "DELETE_PROJECT", payload: id });
    };

    return (
        <div>
            {profileProjects.length > 0 && (
                <div className="add-skill-form" style={{ marginBottom: '15px', background: '#f8fafc', padding: '10px', borderRadius: '5px' }}>
                    <small style={{ display: 'block', marginBottom: '5px' }}>Add from Your Profile:</small>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select 
                            value={selectedProfileProjIndex} 
                            onChange={(e) => setSelectedProfileProjIndex(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Select Project --</option>
                            {profileProjects.map((proj, index) => (
                                <option key={index} value={index}>{proj.title}</option>
                            ))}
                        </select>
                        <button onClick={handleAddFromProfile} className="btn-add" disabled={selectedProfileProjIndex === ""}>
                            Add
                        </button>
                    </div>
                </div>
            )}

            <div className="form-group">
                <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                    }
                    placeholder="Project Title"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <textarea
                    value={newProject.description}
                    onChange={(e) =>
                        setNewProject({ ...newProject, description: e.target.value })
                    }
                    placeholder="Project Description"
                    rows="3"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <div className="tags-selector">
                    <small>Assign Tags:</small>
                    <div className="tag-options">
                        {predefinedRoles.map((role) => (
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
                <button onClick={handleAddProject} className="btn-add">
                    {newProject.id ? "Update Project" : "Add Project"}
                </button>
            </div>

            <hr />

            <h4>
                Master List <small>(Auto-filtered for: {role})</small>
            </h4>
            <div className="items-list">
                {masterProjects.map((project, index) => {
                    const isSelected = selectedProjects.some((p) => p.id === project.id);
                    return (
                        <div
                            key={project.id || index}
                            className={`item-card ${isSelected ? "selected" : ""}`}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelection(project)}
                                    style={{ marginTop: "5px" }}
                                />
                                <div className="item-content">
                                    <strong>{project.title}</strong>
                                    <p style={{ fontSize: "12px", margin: "2px 0", whiteSpace: "pre-line" }}>
                                        {project.description}
                                    </p>
                                    <div style={{ fontSize: "10px", color: "#666" }}>
                                        Tags: {project.tags.join(", ")}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => handleEdit(project)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue' }}>✎</button>
                                <button onClick={() => handleDelete(project.id)} className="btn-delete">×</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectsSection;
