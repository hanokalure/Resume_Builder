import { useState, useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const CertificatesSection = () => {
    const { state, dispatch } = useResume();
    const { masterCertificates, selectedCertificates } = state;
    const { user } = useAuth();

    const [newCert, setNewCert] = useState({
        id: null,
        name: "",
        url: "",
    });
    const [profileCerts, setProfileCerts] = useState([]);
    const [selectedProfileCertIndex, setSelectedProfileCertIndex] = useState("");

    useEffect(() => {
        if (user) {
            const fetchProfileCerts = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('certificates')
                    .eq('id', user.id)
                    .single();
                if (data && data.certificates) {
                    setProfileCerts(data.certificates);
                }
            };
            fetchProfileCerts();
        }
    }, [user]);

    const handleAddCert = () => {
        if (!newCert.name.trim()) return;

        if (newCert.id) {
            // Update
            dispatch({ type: "UPDATE_CERTIFICATE", payload: newCert });
        } else {
            // Add
            const cert = {
                ...newCert,
                id: Date.now().toString(),
            };
            dispatch({ type: "ADD_CERTIFICATE", payload: cert });
        }

        setNewCert({ id: null, name: "", url: "" });
    };

    const handleAddFromProfile = () => {
        if (selectedProfileCertIndex === "") return;
        const cert = profileCerts[selectedProfileCertIndex];
        
        if (!masterCertificates.some(c => c.name === cert.name)) {
            const newCertEntry = {
                id: Date.now().toString(),
                name: cert.name,
                url: cert.url || "",
            };
            dispatch({ type: "ADD_CERTIFICATE", payload: newCertEntry });
        }
        setSelectedProfileCertIndex("");
    };

    const handleEdit = (cert) => {
        setNewCert(cert);
    };

    const handleToggleSelection = (cert) => {
        dispatch({ type: "TOGGLE_CERTIFICATE", payload: cert });
    };

    const handleDelete = (id) => {
        dispatch({ type: "DELETE_CERTIFICATE", payload: id });
    };

    return (
        <div>
            {profileCerts.length > 0 && (
                <div className="add-skill-form" style={{ marginBottom: '15px', background: '#f8fafc', padding: '10px', borderRadius: '5px' }}>
                    <small style={{ display: 'block', marginBottom: '5px' }}>Add from Your Profile:</small>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select 
                            value={selectedProfileCertIndex} 
                            onChange={(e) => setSelectedProfileCertIndex(e.target.value)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Select a certificate --</option>
                            {profileCerts.map((cert, index) => (
                                <option key={index} value={index}>{cert.name}</option>
                            ))}
                        </select>
                        <button onClick={handleAddFromProfile} className="btn-add" disabled={selectedProfileCertIndex === ""}>
                            Add
                        </button>
                    </div>
                </div>
            )}

            <div className="form-group">
                <input
                    type="text"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                    placeholder="Certificate Name"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <input
                    type="text"
                    value={newCert.url}
                    onChange={(e) => setNewCert({ ...newCert, url: e.target.value })}
                    placeholder="URL (Optional)"
                    style={{ marginBottom: "5px", width: "100%" }}
                />

                <button onClick={handleAddCert} className="btn-add">
                    {newCert.id ? "Update Certificate" : "Add Certificate"}
                </button>
            </div>

            <hr />

            <div className="skills-list">
                {masterCertificates.map((cert, index) => {
                    const isSelected = selectedCertificates.some((c) => c.id === cert.id);
                    return (
                        <div key={cert.id || index} className={`skill-item ${isSelected ? "selected" : ""}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: "flex", width: "100%", alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelection(cert)}
                                    style={{ marginRight: "10px" }}
                                />
                                <div style={{ flex: 1 }}>
                                    <span>
                                        <strong>{cert.name}</strong>
                                    </span>
                                    {cert.url && <div style={{ fontSize: "10px", color: "blue" }}>{cert.url}</div>}
                                </div>
                            </label>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => handleEdit(cert)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue', padding: '0 5px' }}>✎</button>
                                <button onClick={() => handleDelete(cert.id)} className="btn-delete">×</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CertificatesSection;
