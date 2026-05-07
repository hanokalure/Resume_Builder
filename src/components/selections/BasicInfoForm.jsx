import { useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const BasicInfoForm = () => {
    const { state, dispatch } = useResume();
    const { basicInfo } = state;
    const { user } = useAuth();

    useEffect(() => {
        // Automatically fetch and fill if the user hasn't typed anything yet
        const fetchProfileBasicInfo = async () => {
            if (user && !basicInfo.name && !basicInfo.email && !basicInfo.phone) {
                const { data } = await supabase
                    .from('profiles')
                    .select('basic_info')
                    .eq('id', user.id)
                    .single();

                if (data && data.basic_info) {
                    dispatch({
                        type: "UPDATE_BASIC_INFO",
                        payload: data.basic_info,
                    });
                }
            }
        };
        fetchProfileBasicInfo();
    }, [user, basicInfo.name, basicInfo.email, basicInfo.phone, dispatch]);

    const handleChange = (e) => {
        dispatch({
            type: "UPDATE_BASIC_INFO",
            payload: { [e.target.name]: e.target.value },
        });
    };

    return (
        <div>
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
                <div className="form-row-split">
                    <input
                        type="email"
                        name="email"
                        value={basicInfo.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                    />
                    <input
                        type="text"
                        name="emailText"
                        value={basicInfo.emailText || ""}
                        onChange={handleChange}
                        placeholder="Display Text (Optional)"
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
                <div className="form-row-split">
                    <input
                        type="text"
                        name="linkedin"
                        value={basicInfo.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/johndoe"
                    />
                    <input
                        type="text"
                        name="linkedinText"
                        value={basicInfo.linkedinText || ""}
                        onChange={handleChange}
                        placeholder="Display Text (Optional)"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>GitHub</label>
                <div className="form-row-split">
                    <input
                        type="text"
                        name="github"
                        value={basicInfo.github}
                        onChange={handleChange}
                        placeholder="github.com/johndoe"
                    />
                    <input
                        type="text"
                        name="githubText"
                        value={basicInfo.githubText || ""}
                        onChange={handleChange}
                        placeholder="Display Text (Optional)"
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfoForm;
