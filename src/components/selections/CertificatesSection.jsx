import { useState } from "react";
import { useResume } from "../../context/ResumeContext";

const CertificatesSection = () => {
    const { state, dispatch } = useResume();
    const { masterCertificates, selectedCertificates } = state;

    const [newCert, setNewCert] = useState({
        id: null,
        name: "",
        issuer: "",
        year: "",
        url: "",
    });

    const handleAddCert = () => {
        if (!newCert.name.trim()) return;

        if (newCert.id) {
            // Update
            dispatch({ type: "UPDATE_CERTIFICATE", payload: newCert });
        } else {
            // Add
            const cert = {
                id: Date.now().toString(),
                ...newCert,
            };
            dispatch({ type: "ADD_CERTIFICATE", payload: cert });
        }

        setNewCert({ id: null, name: "", issuer: "", year: "", url: "" });
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
        <div className="section-form">
            <h3>Certifications</h3>

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
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    placeholder="Issuer"
                    style={{ marginBottom: "5px", width: "100%" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        value={newCert.year}
                        onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                        placeholder="Year"
                        style={{ marginBottom: "5px", flex: 1 }}
                    />
                    <input
                        type="text"
                        value={newCert.url}
                        onChange={(e) => setNewCert({ ...newCert, url: e.target.value })}
                        placeholder="URL (Optional)"
                        style={{ marginBottom: "5px", flex: 2 }}
                    />
                </div>

                <button onClick={handleAddCert} className="btn-add">
                    {newCert.id ? "Update Certificate" : "Add Certificate"}
                </button>
            </div>

            <hr />

            <div className="skills-list">
                {masterCertificates.map((cert) => {
                    const isSelected = selectedCertificates.some((c) => c.id === cert.id);
                    return (
                        <div key={cert.id} className={`skill-item ${isSelected ? "selected" : ""}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: "flex", width: "100%", alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelection(cert)}
                                    style={{ marginRight: "10px" }}
                                />
                                <div style={{ flex: 1 }}>
                                    <span>
                                        <strong>{cert.name}</strong> - {cert.issuer} ({cert.year})
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
