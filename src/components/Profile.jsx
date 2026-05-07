import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [basicInfo, setBasicInfo] = useState({
    name: '', email: '', phone: '', linkedin: '', github: ''
  });
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', year: '', gpa: '', gradeType: 'CGPA' });
  const [newExp, setNewExp] = useState({ company: '', role: '', duration: '', description: '' });
  const [newProj, setNewProj] = useState({ title: '', description: '' });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('skills, certificates, basic_info, education, experience, projects')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      if (error.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, skills: [], certificates: [], basic_info: {}, education: [], experience: [], projects: [] }]);
        if (insertError) console.error('Error creating profile:', insertError);
      }
    } else if (data) {
      setSkills(data.skills || []);
      setCertificates(data.certificates || []);
      setBasicInfo(data.basic_info || { name: '', email: '', phone: '', linkedin: '', github: '' });
      setEducation(data.education || []);
      setExperience(data.experience || []);
      setProjects(data.projects || []);
    }
    setLoading(false);
  };

  const saveProfile = async (updates) => {
    setSaving(true);
    const payload = {
      basic_info: basicInfo,
      skills,
      certificates,
      education,
      experience,
      projects,
      ...updates
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id);

    if (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    }
    setSaving(false);
  };

  const handleBasicInfoChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handleSaveBasicInfo = () => {
    saveProfile({ basic_info: basicInfo });
    alert('Basic Info saved!');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      setNewSkill('');
      saveProfile({ skills: updated });
    }
  };

  const handleRemoveItem = (type, indexOrVal) => {
    if (type === 'skill') {
      const updated = skills.filter((s) => s !== indexOrVal);
      setSkills(updated);
      saveProfile({ skills: updated });
    } else if (type === 'cert') {
      const updated = certificates.filter((_, i) => i !== indexOrVal);
      setCertificates(updated);
      saveProfile({ certificates: updated });
    } else if (type === 'edu') {
      const updated = education.filter((_, i) => i !== indexOrVal);
      setEducation(updated);
      saveProfile({ education: updated });
    } else if (type === 'exp') {
      const updated = experience.filter((_, i) => i !== indexOrVal);
      setExperience(updated);
      saveProfile({ experience: updated });
    } else if (type === 'proj') {
      const updated = projects.filter((_, i) => i !== indexOrVal);
      setProjects(updated);
      saveProfile({ projects: updated });
    }
  };

  const handleAddCert = () => {
    if (newCert.name.trim()) {
      const updated = [...certificates, newCert];
      setCertificates(updated);
      setNewCert({ name: '', issuer: '', year: '' });
      saveProfile({ certificates: updated });
    }
  };

  const handleAddEdu = () => {
    if (newEdu.institution.trim()) {
      const updated = [...education, newEdu];
      setEducation(updated);
      setNewEdu({ institution: '', degree: '', year: '', gpa: '', gradeType: 'CGPA' });
      saveProfile({ education: updated });
    }
  };

  const handleAddExp = () => {
    if (newExp.company.trim()) {
      const updated = [...experience, newExp];
      setExperience(updated);
      setNewExp({ company: '', role: '', duration: '', description: '' });
      saveProfile({ experience: updated });
    }
  };

  const handleAddProj = () => {
    if (newProj.title.trim()) {
      const updated = [...projects, { ...newProj, tags: ["General"] }];
      setProjects(updated);
      setNewProj({ title: '', description: '' });
      saveProfile({ projects: updated });
    }
  };

  if (loading) return <div className="loading-screen">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={() => navigate('/')} className="back-button">← Back to Builder</button>
      </div>

      <div className="profile-section">
        <h2>Basic Information</h2>
        <div className="responsive-grid">
          <div className="form-field"><label>Full Name</label><input type="text" name="name" value={basicInfo.name || ''} onChange={handleBasicInfoChange} /></div>
          <div className="form-field"><label>Email</label><input type="email" name="email" value={basicInfo.email || ''} onChange={handleBasicInfoChange} /></div>
          <div className="form-field"><label>Phone</label><input type="text" name="phone" value={basicInfo.phone || ''} onChange={handleBasicInfoChange} /></div>
          <div className="form-field"><label>LinkedIn URL</label><input type="text" name="linkedin" value={basicInfo.linkedin || ''} onChange={handleBasicInfoChange} /></div>
          <div className="form-field full-width"><label>GitHub URL</label><input type="text" name="github" value={basicInfo.github || ''} onChange={handleBasicInfoChange} /></div>
        </div>
        <button onClick={handleSaveBasicInfo} disabled={saving} className="save-btn">
          {saving ? 'Saving...' : 'Save Basic Info'}
        </button>
      </div>

      <div className="profile-section">
        <h2>Education</h2>
        <div className="cert-input-group edu-group">
          <input type="text" value={newEdu.institution} onChange={(e) => setNewEdu({...newEdu, institution: e.target.value})} placeholder="Institution" />
          <input type="text" value={newEdu.degree} onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})} placeholder="Degree" />
          <input type="text" value={newEdu.year} onChange={(e) => setNewEdu({...newEdu, year: e.target.value})} placeholder="Year" />
          <input type="text" value={newEdu.gpa} onChange={(e) => setNewEdu({...newEdu, gpa: e.target.value})} placeholder="GPA" />
          <button onClick={handleAddEdu} disabled={saving}>Add Edu</button>
        </div>
        <ul className="cert-list">
          {education.map((edu, idx) => (
            <li key={idx} className="cert-item">
              <div className="item-details"><strong>{edu.institution}</strong> - {edu.degree} ({edu.year})</div>
              <button onClick={() => handleRemoveItem('edu', idx)} className="remove-btn">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="profile-section">
        <h2>Experience</h2>
        <div className="complex-input-group">
          <div className="responsive-flex">
            <input type="text" value={newExp.company} onChange={(e) => setNewExp({...newExp, company: e.target.value})} placeholder="Company" />
            <input type="text" value={newExp.role} onChange={(e) => setNewExp({...newExp, role: e.target.value})} placeholder="Role" />
            <input type="text" value={newExp.duration} onChange={(e) => setNewExp({...newExp, duration: e.target.value})} placeholder="Duration (e.g. 2020-2022)" />
          </div>
          <textarea value={newExp.description} onChange={(e) => setNewExp({...newExp, description: e.target.value})} placeholder="Description (bullet points)" />
          <button onClick={handleAddExp} disabled={saving} className="add-btn">Add Exp</button>
        </div>
        <ul className="cert-list">
          {experience.map((exp, idx) => (
            <li key={idx} className="cert-item align-start">
              <div className="item-details full-width-details">
                <strong>{exp.company} - {exp.role} ({exp.duration})</strong>
              </div>
              <button onClick={() => handleRemoveItem('exp', idx)} className="remove-btn">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="profile-section">
        <h2>Projects</h2>
        <div className="complex-input-group">
          <input type="text" value={newProj.title} onChange={(e) => setNewProj({...newProj, title: e.target.value})} placeholder="Project Title" />
          <textarea value={newProj.description} onChange={(e) => setNewProj({...newProj, description: e.target.value})} placeholder="Project Description" />
          <button onClick={handleAddProj} disabled={saving} className="add-btn">Add Project</button>
        </div>
        <ul className="cert-list">
          {projects.map((proj, idx) => (
            <li key={idx} className="cert-item">
              <div className="item-details"><strong>{proj.title}</strong></div>
              <button onClick={() => handleRemoveItem('proj', idx)} className="remove-btn">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="profile-section">
        <h2>My Skills</h2>
        <div className="input-group">
          <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g. JavaScript" onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()} />
          <button onClick={handleAddSkill} disabled={saving}>Add Skill</button>
        </div>
        <ul className="tag-list">
          {skills.map((skill, index) => (
            <li key={index} className="tag-item">{skill}<button onClick={() => handleRemoveItem('skill', skill)} className="remove-btn">×</button></li>
          ))}
        </ul>
      </div>

      <div className="profile-section">
        <h2>My Certificates</h2>
        <div className="cert-input-group">
          <input type="text" value={newCert.name} onChange={(e) => setNewCert({...newCert, name: e.target.value})} placeholder="Certificate Name" />
          <input type="text" value={newCert.issuer} onChange={(e) => setNewCert({...newCert, issuer: e.target.value})} placeholder="Issuer" />
          <input type="text" value={newCert.year} onChange={(e) => setNewCert({...newCert, year: e.target.value})} placeholder="Year" />
          <button onClick={handleAddCert} disabled={saving}>Add Cert</button>
        </div>
        <ul className="cert-list">
          {certificates.map((cert, index) => (
            <li key={index} className="cert-item">
              <div className="item-details"><strong>{cert.name}</strong> - {cert.issuer} ({cert.year})</div>
              <button onClick={() => handleRemoveItem('cert', index)} className="remove-btn">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
