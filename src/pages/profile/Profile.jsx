import React, { useState, useEffect } from "react";
import "../../assets/styles/style.css";
import ProfilePic from "../../assets/img/profile.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faIdBadge,
  faBuilding,
  faBriefcase,
  faEdit,
  faTrash,
  faGear,
  faLock,
  faSave,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5050/api/profile";

const allowedDepartments = [
  "IT", "HR", "Finance", "Marketing", "Sales",
  "Support", "Admin", "Operations", "Legal", "Design"
];

const allowedCountries = [
  { name: "Sri Lanka", code: "+94", digits: 10 },
  { name: "India", code: "+91", digits: 10 },
  { name: "Melbourne", code: "+61", digits: 9 }
];

const Profile = () => {

  // ✅ LOGIN USER ADD (NEW - SAFE)
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    country: "",
    employeeId: "",
    department: "",
    position: ""
  });

  const [profileList, setProfileList] = useState([]);

  const fetchProfiles = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // SAFE handling
    setProfileList(Array.isArray(data) ? data : data.data || []);
  } catch (err) {
    console.error(err);
    alert("Failed to fetch profiles");
  }
};

useEffect(() => {
  fetchProfiles();

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      password: user.password || "",
      mobile: user.mobile || "",
      country: user.country || "",
      employeeId: user.employeeId || "",
      department: user.department || "",
      position: user.position || ""
    });
  }
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      let digits = value.replace(/\D/g, "");

      const countryObj = allowedCountries.find(c => c.code === formData.country);
      if (countryObj) {
        if (digits.length > countryObj.digits) {
          digits = digits.slice(0, countryObj.digits);
        }
      }

      setFormData(prev => ({ ...prev, mobile: digits }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      if (name === "country") {
        setFormData(prev => ({ ...prev, mobile: "" }));
      }
    }
  };

  const validateForm = () => {
    const errors = [];
    const { fullName, email, password, mobile, country, employeeId, department, position } = formData;

    if (!fullName) errors.push("Full Name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (!mobile) errors.push("Mobile is required");
    if (!country) errors.push("Country is required");
    if (!employeeId) errors.push("Employee ID is required");
    if (!department) errors.push("Department is required");
    if (!position) errors.push("Position is required");

    const countryObj = allowedCountries.find(c => c.code === country);
    if (countryObj && mobile.length !== countryObj.digits) {
      errors.push(`Mobile must be exactly ${countryObj.digits} digits for ${countryObj.name}`);
    }

    if (department && !allowedDepartments.includes(department)) {
      errors.push("Invalid department");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push("Invalid email format");
    }

    return errors;
  };

  const handleSave = async () => {
  const errors = validateForm();
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  try {
    let res;
    const payload = { ...formData };

    if (editId) {
      res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      const data = await res.json();
      alert(Array.isArray(data) ? data.join("\n") : data);
      return;
    }

    alert(editId ? "Updated ✅" : "Saved ✅");

    await fetchProfiles(); // ✅ IMPORTANT

    handleCancel();

  } catch (err) {
    alert(err.message);
  }
};

  const handleEdit = (profile) => {
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      password: profile.password || "",
      mobile: profile.mobile || "",
      country: profile.country || "",
      employeeId: profile.employeeId || "",
      department: profile.department || "",
      position: profile.position || ""
    });

    setIsEditing(true);
    setEditId(profile.id);
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      mobile: "",
      country: "",
      employeeId: "",
      department: "",
      position: ""
    });

    setIsEditing(false);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Delete failed");

      setProfileList(profileList.filter(p => p.id !== id));
      alert("Deleted ✅");

    } catch (err) {
      alert(err.message);
    }
  };




  return (
    <div className="container-full profile-page dashboard-style">
      <div className="row-align">

        <div className="profile-header-card">
          <div className="profile-info">

            <img src={ProfilePic} alt="Profile" className="profile-avatar" />

            
            <h3>
              {formData.fullName || loggedUser?.fullName || "User Name"}
            </h3>

            <span className="role-badge">Employee</span>
          </div>
        </div>

        <div className="profile-form-card">

          <div className="header-top">
            <h4><FontAwesomeIcon icon={faUser} /> General Info</h4>

            {!isEditing && (
              <button className="btn-edit" onClick={() => { handleCancel(); setIsEditing(true); }}>
                <FontAwesomeIcon icon={faEdit} /> Add New
              </button>
            )}

            {isEditing && (
              <button className="btn-edit" onClick={handleCancel}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>

          <hr />

          <div className="form-grid">

            {["fullName", "email", "password", "employeeId", "department", "position"].map(field => (
              <div className={`form-group ${field === "position" ? "full-width" : ""}`} key={field}>

                <label>
                  {field === "fullName" && <><FontAwesomeIcon icon={faUser} /> Full Name</>}
                  {field === "email" && <><FontAwesomeIcon icon={faEnvelope} /> Email</>}
                  {field === "password" && <><FontAwesomeIcon icon={faLock} /> Password</>}
                  {field === "employeeId" && <><FontAwesomeIcon icon={faIdBadge} /> Employee ID</>}
                  {field === "department" && <><FontAwesomeIcon icon={faBuilding} /> Department</>}
                  {field === "position" && <><FontAwesomeIcon icon={faBriefcase} /> Position</>}
                </label>

                {field === "department" ? (
                  <select name="department" value={formData.department} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {allowedDepartments.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={
                      field === "fullName" ? "Enter full name" :
                      field === "email" ? "Enter email address" :
                      field === "password" ? "Enter password" :
                      field === "employeeId" ? "Enter employee ID" :
                      field === "position" ? "Enter position" : ""
                    }
                  />
                )}

              </div>
            ))}

            <div className="form-group full-width">
              <label><FontAwesomeIcon icon={faPhone} /> Mobile</label>

              <div style={{ display: "flex", gap: "5px" }}>
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option value="">Select Country</option>
                  {allowedCountries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile digits"
                />
              </div>
            </div>

          </div>

          {isEditing && (
            <button className="btn-save" onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} />
              {editId ? " Update" : " Save"} Profile
            </button>
          )}

        </div>
      </div>

      <div className="account-settings-card">
        <h4><FontAwesomeIcon icon={faGear} /> Profile Records</h4>
        <hr />

        <table className="profile-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Mobile</th>
              <th>Country</th>
              <th>Department</th>
              <th>Position</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {profileList.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Data Found
                </td>
              </tr>
            ) : (
              profileList.map(item => (
                <tr key={item.id}>
                  <td>{item.fullName}</td>
                  <td>{item.email}</td>
                  <td>{item.password}</td>
                  <td>{item.mobile}</td>
                  <td>
  {(() => {
    const c = allowedCountries.find(x => x.code === item.country);
    return c ? `${c.name} (${c.code})` : item.country;
  })()}
</td>
                  <td>{item.department}</td>
                  <td>{item.position}</td>

                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Profile;