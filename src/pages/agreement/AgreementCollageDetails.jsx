import React, { useEffect, useState } from "react";
import DataTable from "../../components/tables/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API = "https://student.nikeeworld.online/colleges";

const AgreementCollage = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [file, setFile] = useState(null);

  // ================= FETCH =================
  const fetchData = async () => {
    const res = await axios.get(API);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (row) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`${API}/${row.id}`);
    fetchData();
  };

  // ================= EDIT =================
  const handleEdit = (row) => {
    setEditData(row);
    setFile(null);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(editData).forEach((key) => {
        formData.append(key, editData[key]);
      });

      if (file) {
        formData.append("file", file);
      }

      await axios.put(`${API}/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Updated successfully ✅");
      setEditData(null);
      setFile(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  const isAgreementDisabled = editData?.hasAgreement === "No";

  // ================= TABLE =================
  const columns = [
    { key: "id", label: "ID" },
    { key: "providerId", label: "College/Provider ID" },
    { key: "tradingName", label: "Trading Name" },
    { key: "instituteName", label: "Institute Name" },
    { key: "cricosCode", label: "CRICOS Code" },
    { key: "websiteLink", label: "Website Link" },
    { key: "hasAgreement", label: "Has Agreement" },
    { key: "agreementName", label: "Agreement Name" },
    { key: "startDate", label: "Start Date" },
    { key: "expireDate", label: "Expire Date" },
    { key: "renewalDate", label: "Renewal Date" },
    { key: "status", label: "Status" },
    { key: "remark", label: "Remark" },

    {
      key: "filePath",
      label: "Attachment",
      render: (row) => {
        if (!row.filePath) return "No File";

        const cleanName = row.filePath.includes("_")
          ? row.filePath.substring(row.filePath.indexOf("_") + 1)
          : row.filePath;

        const fileUrl = `https://student.nikeeworld.online/uploads/${row.filePath}`;

        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <a href={fileUrl} target="_blank" rel="noreferrer">
              {cleanName}
            </a>

            <a href={fileUrl} download={cleanName}>
              <FontAwesomeIcon icon={faDownload} color="green" />
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container-full">

      {/* HEADER */}
      <div className="content-header">
        <h2>Agreement / College Details</h2>

        <p className="sub-title">
          <span>
            <FontAwesomeIcon icon={faHome} className="home" /> - Tables
          </span>{" "}
          - Data Tables
        </p>
      </div>

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* EDIT FORM */}
      {editData && (
        <div className="edit-box">

          <h3 className="edit-title">Edit Agreement and Colleges</h3>

          <div className="form-grid">

            <div className="form-group">
              <label>Provider ID</label>
              <input
                value={editData.providerId || ""}
                onChange={(e) =>
                  setEditData({ ...editData, providerId: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Trading Name</label>
              <input
                value={editData.tradingName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, tradingName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Institute Name</label>
              <input
                value={editData.instituteName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, instituteName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>CRICOS Code</label>
              <input
                value={editData.cricosCode || ""}
                onChange={(e) =>
                  setEditData({ ...editData, cricosCode: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Website Link</label>
              <input
                value={editData.websiteLink || ""}
                onChange={(e) =>
                  setEditData({ ...editData, websiteLink: e.target.value })
                }
              />
            </div>

            {/* ✅ DROPDOWN */}
            <div className="form-group">
              <label>Has Agreement</label>
              <select
                value={editData.hasAgreement || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    hasAgreement: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* ✅ DISABLED WHEN NO */}
            <div className="form-group">
              <label>Agreement Name</label>
              <input
                disabled={isAgreementDisabled}
                value={editData.agreementName || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    agreementName: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
  <label>Status</label>
  <input
    disabled={isAgreementDisabled}
    value={editData.status || ""}
    onChange={(e) =>
      setEditData({ ...editData, status: e.target.value })
    }
  />
</div>

            <div className="form-group">
  <label>Remark</label>
  <input
    disabled={isAgreementDisabled}
    value={editData.remark || ""}
    onChange={(e) =>
      setEditData({ ...editData, remark: e.target.value })
    }
  />
</div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                disabled={isAgreementDisabled}
                value={editData.startDate || ""}
                onChange={(e) =>
                  setEditData({ ...editData, startDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Expire Date</label>
              <input
                type="date"
                disabled={isAgreementDisabled}
                value={editData.expireDate || ""}
                onChange={(e) =>
                  setEditData({ ...editData, expireDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Renewal Date</label>
              <input
                type="date"
                disabled={isAgreementDisabled}
                value={editData.renewalDate || ""}
                onChange={(e) =>
                  setEditData({ ...editData, renewalDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Current File</label>
              <p>{editData.filePath || "No file"}</p>

              <label>Update File</label>
              <input
                type="file"
                disabled={isAgreementDisabled}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

          </div>

          <div className="edit-actions">
            <button className="btn-update" onClick={handleUpdate}>
              Update
            </button>

            <button className="btn-cancel" onClick={() => setEditData(null)}>
              Cancel
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default AgreementCollage;