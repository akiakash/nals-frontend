import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUpload } from "@fortawesome/free-solid-svg-icons";
import FormActions from "../../components/FormActions";
import "../../assets/styles/style.css";

const AddFlyer = () => {
  const [colleges, setColleges] = useState([]);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    provider: "",
    flyers: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("https://student.nikeeworld.online/api/colleges_agreements")
      .then((res) => setColleges(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, provider: e.target.value });
  };

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop().toLowerCase();

      if (!["pdf", "png"].includes(ext)) {
        alert(`${file.name} is invalid. Only PDF or PNG allowed!`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB!`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        flyers: [...prev.flyers, ...validFiles],
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleClick = () => fileInputRef.current.click();

  const removeFile = (index) => {
    setFormData((prev) => {
      const newFiles = [...prev.flyers];
      newFiles.splice(index, 1);
      return { ...prev, flyers: newFiles };
    });
  };

  const handleCancel = () => {
    setFormData({ provider: "", flyers: [] });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.provider) newErrors.providerId = "Please select a provider";
    if (formData.flyers.length === 0) newErrors.flyers = "Please upload at least one file";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = new FormData();
      data.append("providerId", formData.provider);

      formData.flyers.forEach((file) => {
        data.append("flyers", file);
      });

      const res = await axios.post(
        "https://student.nikeeworld.online/api/upload_flyers",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message);
      handleCancel();
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container-full">
      <div className="content-header">
        <h2>ADD NEW FLYER</h2>

        <p className="sub-title">
          <span>
            <FontAwesomeIcon icon={faHome} className="home" /> - Forms
          </span>{" "}
          - General Form Elements
        </p>

        <form className="form-content" onSubmit={handleSubmit}>

          {/* Provider */}
          <div className="form-group">
            <label>College / Provider</label>

            <select value={formData.provider} onChange={handleChange}>
              <option value="">Select College / Provider</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tradingName}
                </option>
              ))}
            </select>

            {errors.providerId && (
              <span className="error">{errors.providerId}</span>
            )}
          </div>

          {/* File Upload */}
          <div className="form-group full">
            <label>Attach Flyer(s)</label>

            <div
              className="upload-box"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <p>Upload or Drag & Drop your file(s)</p>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
                accept=".pdf,.png"
                multiple
              />

              <button
                type="button"
                className="upload-btn"
                onClick={handleClick}
              >
                <FontAwesomeIcon icon={faUpload} /> Select Files
              </button>

              {errors.flyers && (
                <span className="error">{errors.flyers}</span>
              )}

              {/* File List */}
              {formData.flyers.length > 0 && (
                <div className="file-list">
                  {formData.flyers.map((file, i) => (
                    <div key={i} className="file-item">
                      <span>{file.name}</span>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFile(i)}
                      >
                        ✖ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <small>Allowed: PDF, PNG (Max 10MB each)</small>
            </div>
          </div>

          <FormActions onSave={handleSubmit} onCancel={handleCancel} />

        </form>
      </div>
    </div>
  );
};

export default AddFlyer;