import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUpload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import FormActions from "../../components/FormActions";
import "../../assets/styles/style.css";
import { API_BASE } from "../../config/api";

const AddAgreement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState(() => {
    const fromState = location.state?.collegeId;
    const fromQuery = searchParams.get("collegeId");
    if (fromState != null && fromState !== "") return String(fromState);
    if (fromQuery != null && fromQuery !== "") return String(fromQuery);
    return "";
  });

  const [formData, setFormData] = useState({
    agreementName: "",
    startDate: "",
    expireDate: "",
    renewalDate: "",
    status: "",
    remark: "",
    agreementFile: null,
  });

  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loadColleges = async () => {
      setCollegesLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/colleges_agreements`);
        if (cancelled) return;
        const rows = Array.isArray(res.data) ? res.data : [];
        setColleges(rows);
        setSelectedCollegeId((current) => {
          if (current) return current;
          if (rows.length === 1) return String(rows[0].id);
          return "";
        });
      } catch (e) {
        if (!cancelled) setColleges([]);
      } finally {
        if (!cancelled) setCollegesLoading(false);
      }
    };
    loadColleges();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) =>
    setFormData((prev) => ({ ...prev, agreementFile: e.target.files[0] }));

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, agreementFile: file }));
    } else {
      alert("Only PDF files are allowed");
    }
  };

  const handleFileButtonClick = () => fileInputRef.current.click();

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!selectedCollegeId) newErrors.collegeId = "Please select a college";
    if (!formData.agreementName.trim()) newErrors.agreementName = "Agreement Name is required";
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.expireDate) newErrors.expireDate = "Expire Date is required";
    if (!formData.status) newErrors.status = "Status is required";

    // Optional: file validation
    if (!formData.agreementFile) newErrors.agreementFile = "Please upload a PDF file";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const data = new FormData();
    data.append("collegeId", selectedCollegeId);
    data.append("agreementName", formData.agreementName);
    data.append("startDate", formData.startDate);
    data.append("expireDate", formData.expireDate);
    data.append("renewalDate", formData.renewalDate);
    data.append("status", formData.status);
    data.append("remark", formData.remark);
    if (formData.agreementFile) data.append("agreementFile", formData.agreementFile);

    try {
      await axios.post(`${API_BASE}/addagreement`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Agreement saved successfully!");
      navigate("/addcollage");
    } catch (error) {
      console.error("Error saving agreement:", error);
      alert(error.response?.data?.error || "Network error: Could not reach backend");
    }
  };

  const handleCancel = () =>
    setFormData({
      agreementName: "",
      startDate: "",
      expireDate: "",
      renewalDate: "",
      status: "",
      remark: "",
      agreementFile: null,
    });

  return (
    <div className="container-full">
      <div className="content-header">
        <h2>ADD AGREEMENT</h2>
        <p className="sub-title">
          <span>
            <FontAwesomeIcon icon={faHome} className="home" /> - Forms
          </span>{" "}
          - General Form Elements
        </p>

        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-group full">
            <label>College</label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              disabled={collegesLoading}
            >
              <option value="">{collegesLoading ? "Loading colleges…" : "Select college"}</option>
              {colleges.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.tradingName || `College #${c.id}`}
                </option>
              ))}
            </select>
            {errors.collegeId && <span className="error">{errors.collegeId}</span>}
            {!collegesLoading && colleges.length === 0 && (
              <small className="error" style={{ display: "block", marginTop: 6 }}>
                No colleges found. Add a college first, then return here.
              </small>
            )}
          </div>

          <div className="form-group full">
            <label>Agreement Name</label>
            <input
              type="text"
              placeholder="Agreement Name"
              name="agreementName"
              value={formData.agreementName}
              onChange={handleChange}
            />
            {errors.agreementName && <span className="error">{errors.agreementName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
              {errors.startDate && <span className="error">{errors.startDate}</span>}
            </div>
            <div className="form-group">
              <label>Expire Date</label>
              <input type="date" name="expireDate" value={formData.expireDate} onChange={handleChange} />
              {errors.expireDate && <span className="error">{errors.expireDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Renewal Date</label>
              <input type="date" name="renewalDate" value={formData.renewalDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
              {errors.status && <span className="error">{errors.status}</span>}
            </div>
          </div>

          <div className="form-group full">
            <label>Remark</label>
            <textarea name="remark" placeholder="Remark" rows="3" value={formData.remark} onChange={handleChange} />
          </div>

          <div className="form-group full">
  <label>Attach Agreement (PDF)</label>

  <div
    className="upload-box"
    onDragOver={handleDragOver}
    onDrop={handleDrop}
  >
    <p>Upload or Drag & Drop your file</p>

    <input
      type="file"
      accept=".pdf"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
    />

    <button
      type="button"
      className="upload-btn"
      onClick={handleFileButtonClick}
    >
      <FontAwesomeIcon icon={faUpload} /> Select File
    </button>

    {errors.agreementFile && (
      <span className="error">{errors.agreementFile}</span>
    )}

    {/* File Display */}
    {formData.agreementFile && (
      <div className="file-list">
        <div className="file-item">
          <span>{formData.agreementFile.name}</span>

          <button
            type="button"
            className="remove-btn"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                agreementFile: null,
              }))
            }
          >
            ✖ Remove
          </button>
        </div>
      </div>
    )}

    <small>Allowed file extension: PDF (Max 10MB)</small>
  </div>
</div>

          <FormActions onSave={handleSubmit} onCancel={handleCancel} />
        </form>
      </div>
    </div>
  );
};

export default AddAgreement;