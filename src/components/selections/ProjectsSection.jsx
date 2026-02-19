import { useState } from "react";
import { useResume } from "../../context/ResumeContext";

const ProjectsSection = () => {
    const { state, dispatch } = useResume();
    const { masterProjects, selectedProjects, role } = state;

    const [newProject, setNewProject] = useState({
        id: null,
        title: "",
        description: "",
    });
    const [selectedTags, setSelectedTags] = useState([]);

    const predefinedRoles = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
    ];

    const handleAddProject = () => {
        if (!newProject.title.trim()) return;

        if (newProject.id) {
            // Update
            const updatedProject = { ...newProject, tags: selectedTags };
            dispatch({ type: "UPDATE_PROJECT", payload: updatedProject });
        } else {
            // Add
            const project = {
                id: Date.now().toString(),
                ...newProject,
                tags: selectedTags.length > 0 ? selectedTags : ["General"],
            };
            dispatch({ type: "ADD_PROJECT", payload: project });
        }

        setNewProject({ id: null, title: "", description: "" });
        setSelectedTags([]);
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
        <div className="section-form">
            <h3>Projects</h3>

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
                {masterProjects.map((project) => {
                    const isSelected = selectedProjects.some((p) => p.id === project.id);
                    return (
                        <div
                            key={project.id}
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
                                    <p style={{ fontSize: "12px", margin: "2px 0" }}>
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
