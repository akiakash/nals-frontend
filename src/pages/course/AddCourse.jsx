import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import FormActions from "../../components/FormActions";
import "../../assets/styles/style.css";

import axios from "axios";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    courseId: "",
    tradingName: "",
    courseName: "",
    cricosCode: "",
    totalFee: "",
    duration: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes with formatting
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "totalFee") {
      // Only numeric input
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else if (name === "duration") {
      // Only numeric input
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else if (name === "cricosCode") {
      // Uppercase letters and numbers only
      const formattedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Form validation
  const validateForm = () => {
    const { courseId, tradingName, courseName, cricosCode, totalFee, duration, state } = formData;
    const newErrors = {};

    if (!courseId.trim()) newErrors.courseId = "Course ID is required";
    if (!tradingName.trim()) newErrors.tradingName = "Trading Name is required";
    if (!courseName.trim()) newErrors.courseName = "Course Name is required";
    if (!cricosCode.trim()) newErrors.cricosCode = "CRICOS Code is required";
    if (!totalFee.trim()) newErrors.totalFee = "Total Fee is required";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!state.trim()) newErrors.state = "State is required";

    return newErrors;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return; // stop if validation fails

    // Format fee and duration
    const formattedData = {
      ...formData,
      totalFee: `$${formData.totalFee}`,
      duration: `${formData.duration} Weeks`,
    };

    try {
      const response = await axios.post("http://localhost:5050/api/courses", formattedData);
      alert(response.data.message);
      handleCancel(); // reset form
      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Error adding course");
    }
  };

  // Reset form
  const handleCancel = () => {
    setFormData({
      courseId: "",
      tradingName: "",
      courseName: "",
      cricosCode: "",
      totalFee: "",
      duration: "",
      state: "",
    });
    setErrors({});
  };

  return (
    <div className="container-full">
      <div className="content-header">
        <h2>ADD NEW COURSE</h2>
        <p className="sub-title">
          <span>
            <FontAwesomeIcon icon={faHome} className="home" /> - Forms
          </span>{" "}
          - General Form Elements
        </p>
      </div>

      <form className="form-content" onSubmit={handleSubmit}>
        <div className="form-group full">
          <label>Course ID</label>
          <input
            type="text"
            name="courseId"
            placeholder="Course ID"
            value={formData.courseId}
            onChange={handleChange}
          />
          {errors.courseId && <span className="error">{errors.courseId}</span>}
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
          <label>Course Name</label>
          <input
            type="text"
            name="courseName"
            placeholder="Course Name"
            value={formData.courseName}
            onChange={handleChange}
          />
          {errors.courseName && <span className="error">{errors.courseName}</span>}
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
            <label>Total Fee</label>
            <input
              type="text"
              name="totalFee"
              placeholder="Total Fee (numbers only)"
              value={formData.totalFee}
              onChange={handleChange}
            />
            {errors.totalFee && <span className="error">{errors.totalFee}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="Duration (weeks)"
              value={formData.duration}
              onChange={handleChange}
            />
            {errors.duration && <span className="error">{errors.duration}</span>}
          </div>

         <div className="form-group custom-select">
  <label>State</label>
  <select
    name="state"
    value={formData.state}
    onChange={handleChange}
  >
    <option value="" disabled hidden>Select State</option>
    <option value="NSW">NSW</option>
    <option value="VIC">VIC</option>
    <option value="QLD">QLD</option>
    <option value="WA">WA</option>
    <option value="SA">SA</option>
    <option value="TAS">TAS</option>
    <option value="NT">NT</option>
    <option value="ACT">ACT</option>
  </select>

  {errors.state && <span className="error">{errors.state}</span>}
</div>
        </div>

        <FormActions onSave={handleSubmit} onCancel={handleCancel} />
      </form>
    </div>
  );
};

export default AddCourse;