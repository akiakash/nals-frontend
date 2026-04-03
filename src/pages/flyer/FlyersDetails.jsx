import { useEffect, useState } from "react";
import DataTable from "../../components/tables/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const FlyersDetails = () => {
  const [flyers, setFlyers] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchFlyers();
  }, []);

  const fetchFlyers = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/flyers");
      setFlyers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setFlyers([]);
    }
  };

  const handleEdit = (row) => {
    setEditData({
      ...row,
      fileObj: null,
      removed: false,
    });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      if (!editData.removed) {
        formData.append("filePath", editData.filePath || "");
      }

      if (editData.fileObj) {
        formData.append("file", editData.fileObj);
      }

      await axios.put(
        `http://localhost:5050/api/flyers/${editData.id}`,
        formData
      );

      alert("Updated successfully ✅");
      setEditData(null);
      fetchFlyers();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Update failed ❌");
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete ${row.filePath}?`)) return;

    try {
      await axios.delete(`http://localhost:5050/api/flyers/${row.id}`);
      fetchFlyers();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: "tradingName", label: "COLLEGE / PROVIDER" },
    {
      key: "filePath",
      label: "FLYER",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <a
            href={`http://localhost:5050/uploads/${row.filePath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.filePath}
          </a>

          <a
            href={`http://localhost:5050/uploads/${row.filePath}`}
            download
            style={{ color: "green" }}
          >
            <FontAwesomeIcon icon={faDownload} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="container-full">

      {/* HEADER */}
      <div className="content-header">
        <h2>FLYERS DETAILS</h2>
        <p>
          <FontAwesomeIcon icon={faHome} /> - Tables
        </p>
      </div>

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={flyers}
        showActions
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ================= SIMPLE EDIT BOX ================= */}
      {editData && (
        <div className="edit-box">

          <h3 style={{ marginBottom: "15px" }}>Edit Flyer</h3>

          {/* College */}
          <div style={{ display: "flex", marginBottom: "10px", gap: "10px" }}>
            <div style={{ width: "140px" }}>College</div>
            <input
              value={editData.tradingName}
              readOnly
              style={{ flex: 1, padding: "6px" }}
            />
          </div>

          {/* Current file */}
          <div style={{ display: "flex", marginBottom: "10px", gap: "10px" }}>
            <div style={{ width: "140px" }}>Current File</div>

            {editData.filePath && !editData.removed ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <a
                  href={`http://localhost:5050/uploads/${editData.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {editData.filePath}
                </a>

                <button
                                  className="btn-trash"
                                  onClick={() => removeForm(i)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
              </div>
            ) : (
              <span>No file</span>
            )}
          </div>

          {/* Upload */}
          <div style={{ display: "flex", marginBottom: "10px", gap: "10px" }}>
            <div style={{ width: "140px" }}>Upload New</div>

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setEditData({
                  ...editData,
                  fileObj: file,
                  removed: false,
                });
              }}
            />
          </div>

          {editData.fileObj && (
            <p>Selected: {editData.fileObj.name}</p>
          )}

       <div className="edit-actions">

            <button className="btn-update" onClick={handleUpdate}>
              Update
            </button>

            <button
              className="btn-cancel"
              onClick={() => setEditData(null)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default FlyersDetails;