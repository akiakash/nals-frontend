import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import FormActions from "../../components/FormActions";
import "../../assets/styles/style.css";

const AddCollege = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    providerId: "",
    tradingName: "",
    instituteName: "",
    cricosCode: "",
    websiteLink: "",
    hasAgreement: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cricosCode") {
      // Uppercase letters + numbers only
      const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.providerId.trim()) newErrors.providerId = "Provider ID is required";
    if (!formData.tradingName.trim()) newErrors.tradingName = "Trading Name is required";
    if (!formData.instituteName.trim()) newErrors.instituteName = "Institute Name is required";
    if (!formData.cricosCode.trim()) newErrors.cricosCode = "CRICOS Code is required";

    // Website must be a valid URL
    if (!formData.websiteLink.trim()) {
      newErrors.websiteLink = "Website Link is required";
    } else {
      try {
        new URL(formData.websiteLink);
      } catch {
        newErrors.websiteLink = "Invalid URL";
      }
    }

    if (!formData.hasAgreement) newErrors.hasAgreement = "Please select Yes or No";

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return; // stop if validation fails

    try {
      // Save college row first
      const res = await axios.post("http://localhost:5050/addcollege", formData);
      const collegeId = res.data.insertId;

      if (formData.hasAgreement === "Yes") {
        // Redirect to AddAgreement page with collegeId
        navigate("/addagreement", { state: { collegeId } });
      } else {
        alert("College saved successfully!");
        handleCancel();
      }
    } catch (error) {
      console.error("Error saving college:", error);
      alert(error.response?.data?.error || "Network error: Could not reach backend");
    }
  };

  const handleCancel = () =>
    setFormData({
      providerId: "",
      tradingName: "",
      instituteName: "",
      cricosCode: "",
      websiteLink: "",
      hasAgreement: "",
    });

  return (
    <div className="container-full">
      <div className="content-header">
        <h2>ADD NEW COLLEGE</h2>
        <p className="sub-title">
          <span>
            <FontAwesomeIcon icon={faHome} className="home" /> - Forms
          </span>{" "}
          - General Form Elements
        </p>

        <div className="form-content">
          <div className="form-group full">
            <label>College / Provider ID</label>
            <input
              type="text"
              name="providerId"
              placeholder="College / Provider ID"
              value={formData.providerId}
              onChange={handleChange}
            />
            {errors.providerId && <span className="error">{errors.providerId}</span>}
          </div>

          <div className="form-group full">
            <label>Trading Name</label>
            <input
              type="text"
              name="tradingName"
              placeholder="Trading Name"
              value={formData.tradingName}
              onChange={handleChange}
            />
            {errors.tradingName && <span className="error">{errors.tradingName}</span>}
          </div>

          <div className="form-group full">
            <label>Institute Name</label>
            <input
              type="text"
              name="instituteName"
              placeholder="Institute Name"
              value={formData.instituteName}
              onChange={handleChange}
            />
            {errors.instituteName && <span className="error">{errors.instituteName}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CRICOS Code</label>
              <input
                type="text"
                name="cricosCode"
                placeholder="CRICOS Code (e.g. 03483G)"
                value={formData.cricosCode}
                onChange={handleChange}
              />
              {errors.cricosCode && <span className="error">{errors.cricosCode}</span>}
            </div>

            <div className="form-group">
              <label>Website Link</label>
              <input
                type="text"
                name="websiteLink"
                placeholder="Website Link (https://example.com)"
                value={formData.websiteLink}
                onChange={handleChange}
              />
              {errors.websiteLink && <span className="error">{errors.websiteLink}</span>}
            </div>
          </div>

          <div className="form-group full radio-inline">
            <label className="radio-main-label">
              Is there an agreement in place with this college?
            </label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="hasAgreement"
                  value="Yes"
                  checked={formData.hasAgreement === "Yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="hasAgreement"
                  value="No"
                  checked={formData.hasAgreement === "No"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
            {errors.hasAgreement && <span className="error">{errors.hasAgreement}</span>}
          </div>

          <FormActions onSave={handleSave} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default AddCollege;