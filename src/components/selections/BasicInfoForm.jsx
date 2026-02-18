import { useResume } from "../../context/ResumeContext";

const BasicInfoForm = () => {
    const { state, dispatch } = useResume();
    const { basicInfo } = state;

    const handleChange = (e) => {
        dispatch({
            type: "UPDATE_BASIC_INFO",
            payload: { [e.target.name]: e.target.value },
        });
    };

    return (
        <div className="section-form">
            <h3>Basic Information</h3>
            <div className="form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={basicInfo.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                />
            </div>

            <div className="form-group">
                <label>Email</label>
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="email"
                        name="email"
                        value={basicInfo.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        style={{ flex: 1 }}
                    />
                    <input
                        type="text"
                        name="emailText"
                        value={basicInfo.emailText || ""}
                        onChange={handleChange}
                        placeholder="Display Text (Optional)"
                        style={{ flex: 1 }}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={basicInfo.phone}
                    onChange={handleChange}
                    placeholder="+1 555 123 4567"
                />
            </div>

            <div className="form-group">
                <label>LinkedIn</label>
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        name="linkedin"
                        value={basicInfo.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/johndoe"
                        style={{ flex: 1 }}
                    />
                    <input
                        type="text"
                        name="linkedinText"
                        value={basicInfo.linkedinText || ""}
                        onChange={handleChange}
                        placeholder="Display Text (Optional)"
                        style={{ flex: 1 }}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>GitHub</label>
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        name="github"
                        value={basicInfo.github}
                        onChange={handleChange}
                        placeholder="github.com/johndoe"
                        style={{ flex: 1 }}
                    />
                    <input
                        type="text"
                        name="githubText"
                        value={basicInfo.githubText || ""}
                        onChange={handleChange}
                        placeholder="Display Text (Optional)"
                        style={{ flex: 1 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfoForm;
