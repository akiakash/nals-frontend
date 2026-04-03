import React, { useEffect, useState } from "react";
import DataTable from "../../components/tables/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDownload,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API = "https://student.nikeeworld.online
/api/enrolments";

const StudentEnrolment = () => {
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await axios.get(API);

      console.log("API DATA 👉", res.data); // DEBUG

      const grouped = {};

      res.data.forEach((item) => {
        const key = item.collegeId || `no-college-${item.id}`;

        // ================= PARSE FORMS =================
        let forms = [];
        try {
          forms =
            typeof item.formsData === "string"
              ? JSON.parse(item.formsData)
              : item.formsData || [];
        } catch {
          forms = [];
        }

        // ================= GROUP INIT =================
        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            ids: [],
            collegeName: item.tradingName || "Unknown Provider", // ✅ FIX HERE
            enrolmentUrl: item.enrolmentUrl || "",
            username: item.username || "",
            password: item.password || "",
            email: item.email || "",
            forms: [],
          };
        }

        grouped[key].ids.push(item.id);

        // ================= PUSH FORMS =================
        forms.forEach((f) => {
          grouped[key].forms.push({
            name: f.name || "",
            file: f.file || "",
            fileObj: null,
          });
        });
      });

      setData(Object.values(grouped));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= EDIT =================
  const handleEdit = (row) => {
    setEditData({
      ...row,
      forms: row.forms ? [...row.forms] : [],
    });
  };

  // ================= DELETE =================
  const handleDelete = async (row) => {
    if (!window.confirm(`Delete ${row.collegeName}?`)) return;

    try {
      await Promise.all(row.ids.map((id) => axios.delete(`${API}/${id}`)));
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("enrolmentUrl", editData?.enrolmentUrl || "");
      formData.append("username", editData?.username || "");
      formData.append("password", editData?.password || "");
      formData.append("email", editData?.email || "");
      formData.append("formsData", JSON.stringify(editData?.forms || []));

      editData.forms.forEach((f) => {
        if (f.fileObj) {
          formData.append("files", f.fileObj);
        }
      });

      await Promise.all(
        editData.ids.map((id) =>
          axios.put(`${API}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        )
      );

      setEditData(null);
      fetchData();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ================= FORM HANDLERS =================
  const handleFormChange = (index, field, value) => {
    const updated = [...(editData?.forms || [])];
    if (!updated[index]) return;

    updated[index] = { ...updated[index], [field]: value };
    setEditData({ ...editData, forms: updated });
  };

  const handleFileChange = (index, file) => {
    const updated = [...(editData?.forms || [])];
    if (!updated[index]) return;

    updated[index] = {
      ...updated[index],
      fileObj: file,
      file: file?.name || updated[index].file,
    };

    setEditData({ ...editData, forms: updated });
  };

  const addForm = () => {
    setEditData({
      ...editData,
      forms: [
        ...(editData?.forms || []),
        { name: "", file: "", fileObj: null },
      ],
    });
  };

  const removeForm = (index) => {
    const updated = [...(editData?.forms || [])];
    updated.splice(index, 1);
    setEditData({ ...editData, forms: updated });
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { key: "id", label: "ID" },
    { key: "collegeName", label: "College / Provider" },
    { key: "enrolmentUrl", label: "Enrolment URL" },
    { key: "username", label: "User Name" },
    { key: "password", label: "Password" },
    { key: "email", label: "Email" },
    {
      key: "forms",
      label: "FORMS",
      render: (row) => {
        if (!row.forms?.length) return "No Forms";

        return row.forms.map((f, i) => (
          <div key={i}>
            <a
              href={`https://student.nikeeworld.online
/uploads/${f.file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {f.name} - {f.file}
            </a>

            <a
              href={`https://student.nikeeworld.online
/uploads/${f.file}`}
              download
              style={{ marginLeft: "10px", color: "green" }}
            >
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        ));
      },
    },
  ];

  const fields = [
    { label: "Enrolment Url", key: "enrolmentUrl" },
    { label: "User Name", key: "username" },
    { label: "Password", key: "password" },
    { label: "Email", key: "email" },
  ];

  return (
    <div className="container-full">

      <div className="content-header">
        <h2>Student Enrolment Details</h2>
        <p className="sub-title">
          <FontAwesomeIcon icon={faHome} /> - Tables - Data Tables
        </p>
      </div>

      <div className="table-card">
        <DataTable
          columns={columns}
          data={data}
          showActions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {editData && (
        <div className="edit-box">

          <h3 className="edit-title">Edit Enrolment</h3>

          <div className="form-grid">

            <div className="form-group full">
              <label>College / Provider</label>
              <input value={editData.collegeName} disabled />
            </div>

            {fields.map((f) => (
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                <input
                  value={editData?.[f.key] || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      [f.key]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

          </div>

          <div className="forms-box">

            <div className="forms-header">
              <label>Related Forms</label>

              <button className="btn-add" onClick={addForm}>
                <FontAwesomeIcon icon={faPlus} /> Add Form
              </button>
            </div>

            {editData?.forms?.map((f, i) => (
              <div key={i} className="form-row">

                <input
                  placeholder="Form Name"
                  value={f.name}
                  onChange={(e) =>
                    handleFormChange(i, "name", e.target.value)
                  }
                />

                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(i, e.target.files[0])
                  }
                />

                <span className="file-name">{f.file}</span>

                <button
                  className="btn-trash"
                  onClick={() => removeForm(i)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>

              </div>
            ))}

          </div>

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

export default StudentEnrolment;