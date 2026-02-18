import { useResume } from "../../context/ResumeContext";

const RoleSelector = () => {
    const { state, dispatch } = useResume();
    const { role } = state;

    const handleChange = (e) => {
        const newRole = e.target.value;
        dispatch({
            type: "SET_ROLE",
            payload: newRole,
        });
        dispatch({
            type: "AUTO_FILTER_SKILLS",
            payload: newRole,
        });
        dispatch({
            type: "AUTO_FILTER_PROJECTS",
            payload: newRole,
        });
    };

    return (
        <div className="section-form">
            <h3>Target Role</h3>
            <div className="form-group">
                <label htmlFor="role-select">Select Role</label>
                <select
                    id="role-select"
                    value={role}
                    onChange={handleChange}
                    className="role-select"
                >
                    <option value="">-- Select a Role --</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Custom">Custom</option>
                </select>
            </div>
            {role === "Custom" && (
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Enter custom role..."
                        onChange={(e) => dispatch({ type: "SET_ROLE", payload: e.target.value })}
                    />
                </div>
            )}
        </div>
    );
};

export default RoleSelector;
