import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FaPaperclip, FaTrash } from "react-icons/fa";
import axios from "axios";

import FormActions from "../../components/FormActions";
import "../../assets/styles/style.css";

const AddEnrolment = () => {
  const fileRefs = useRef([]);
  const [colleges, setColleges] = useState([]);

  const [formData, setFormData] = useState({
    college: "",
    enrolmentUrl: "",
    username: "",
    password: "",
    email: "",
  });

  const [forms, setForms] = useState([{ name: "", file: null }]);
  const [errors, setErrors] = useState({});

  // Fetch colleges
  useEffect(() => {
    axios
      .get("https://student.nikeeworld.online
/api/colleges_agreements")
      .then((res) => setColleges(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddForm = () => {
    setForms((prev) => [...prev, { name: "", file: null }]);
  };

  const handleRemoveForm = (index) => {
    const updated = forms.filter((_, i) => i !== index);
    setForms(updated);

    // keep refs in sync
    fileRefs.current.splice(index, 1);
  };

  const handleFormNameChange = (index, value) => {
    const updated = [...forms];
    updated[index].name = value;
    setForms(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...forms];
    updated[index].file = file;
    setForms(updated);
  };

  const openFilePicker = (index) => {
    fileRefs.current[index]?.click();
  };

  // Submit
const handleSubmit = async () => {
  const newErrors = {};

  if (!formData.college) newErrors.college = "Please select a college";
  if (!formData.enrolmentUrl) newErrors.enrolmentUrl = "Enrolment URL is required";
  if (!formData.username) newErrors.username = "Username is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (!formData.email) newErrors.email = "Email is required";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    const data = new FormData();

    // ✅ FIX 1 (college → collegeId)
    data.append("collegeId", formData.college);

    data.append("enrolmentUrl", formData.enrolmentUrl);
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("email", formData.email);

    // send names separately
    const formsData = forms.map((f) => ({ name: f.name }));
    data.append("formsData", JSON.stringify(formsData));

    // ✅ FIX 2 (forms → files)
    forms.forEach((f) => {
      if (f.file) {
        data.append("files", f.file);
      }
    });

    // ✅ DEBUG (IMPORTANT)
    console.log("FORM DATA 👉", [...data.entries()]);

    const res = await axios.post(
      "https://student.nikeeworld.online
/api/enrolments",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    alert(res.data.message);
    handleCancel();
  } catch (error) {
    console.log("❌ ERROR:", error.response?.data);
    alert(error.response?.data?.error || "Error saving enrolment");
  }
};
  const handleCancel = () => {
    setFormData({
      college: "",
      enrolmentUrl: "",
      username: "",
      password: "",
      email: "",
    });
    setForms([{ name: "", file: null }]);
    setErrors({});
  };

  return (
    <div className="container-full">
      <div className="content-header">
        <h2>ADD ENROLMENT DETAILS</h2>

      <p className="sub-title">
                <span>
                  <FontAwesomeIcon icon={faHome} className="home" /> - Forms
                </span>{" "}
                - General Form Elements
              </p>
      

        <div className="form-content">

          {/* College */}
          <div className="form-group full">
            <label>College / Provider</label>
            <select
              name="college"
              value={formData.college}
              onChange={handleChange}
            >
              <option value="">-- Select College --</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tradingName}
                </option>
              ))}
            </select>
            {errors.college && <span className="error">{errors.college}</span>}
          </div>

          {/* URL */}
          <div className="form-group full">
            <label>Enrolment URL</label>
            <input
              type="text"
              name="enrolmentUrl"
              placeholder="Enrolment URL"
              value={formData.enrolmentUrl}
              onChange={handleChange}
            />
            {errors.enrolmentUrl && <span className="error">{errors.enrolmentUrl}</span>}
          </div>

          {/* Username & Password */}
          <div className="form-row">
            <div className="form-group">
              <label>User Name</label>
              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
          </div>

          {/* Email */}
          <div className="form-group full">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Forms */}
          <div className="related-header">
            <label>Related Forms</label>
            <button type="button" onClick={handleAddForm}>
              + Add more files
            </button>
          </div>

          {forms.map((form, index) => (
            <div className="related-row" key={index}>
              <div className="form-group full">
                <label>Form Name</label>
                <input
                  placeholder="Form name"
                  value={form.name}
                  onChange={(e) => handleFormNameChange(index, e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>Add Form</label>
                <div className="attach-box" onClick={() => openFilePicker(index)}>
                  <FaPaperclip />
                  <span>{form.file ? form.file.name : "Attach file"}</span>
                </div>

                <input
                  type="file"
                  hidden
                  ref={(el) => (fileRefs.current[index] = el)}
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                />
              </div>

             {forms.length > 1 && (
  <button
    type="button"
    className="remove-btn"
    onClick={() => handleRemoveForm(index)}
  >
    <FaTrash />
  </button>
)}
            </div>
          ))}

          <FormActions onSave={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default AddEnrolment;