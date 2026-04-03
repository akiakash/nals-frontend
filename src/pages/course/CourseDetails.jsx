import { useState, useEffect } from "react";
import DataTable from "../../components/tables/DataTable";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const CourseDetails = () => {
  const [courses, setCourses] = useState([]);
  const [editData, setEditData] = useState(null); // edit state

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE COURSE =================
  const handleDelete = async (row) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete(
        `http://localhost:5050/api/courses/${row.id}`
      );
      fetchCourses();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= EDIT CLICK =================
  const handleEdit = (row) => {
    setEditData(row);
  };

  // ================= UPDATE COURSE =================
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5050/api/courses/${editData.id}`,
        editData
      );

      alert("Updated successfully");
      setEditData(null);
      fetchCourses();
    } catch (err) {
      console.error("Update error:", err);
      alert("Update failed");
    }
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { key: "id", label: "ID" },
    { key: "courseId", label: "Course ID" },
    { key: "courseName", label: "Course Name" },
    { key: "tradingName", label: "Trading Name" },
    { key: "duration", label: "Duration" },
    { key: "totalFee", label: "Total Fee" },
    { key: "state", label: "State" },
    { key: "cricosCode", label: "CRICOS Code" },
  ];

  return (
    <div className="container-full">

      {/* ================= HEADER ================= */}
      <div className="content-header">
        <h2>Course Details</h2>

        <p className="sub-title">
          <span>
            <FontAwesomeIcon icon={faHome} className="home" /> - Tables
          </span>{" "}
          - Data Tables
        </p>
      </div>

      {/* ================= TABLE ================= */}
      <DataTable
        columns={columns}
        data={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ================= EDIT BOX ================= */}
      {editData && (
        <div className="edit-box">

          <h3 className="edit-title">Edit Course</h3>

          <div className="form-grid">

            <div className="form-group">
              <label>Course ID</label>
              <input
                value={editData.courseId}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    courseId: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Course Name</label>
              <input
                value={editData.courseName}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    courseName: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Trading Name</label>
              <input
                value={editData.tradingName}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    tradingName: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                value={editData.duration}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    duration: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Total Fee</label>
              <input
                value={editData.totalFee}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    totalFee: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                value={editData.state}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    state: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>CRICOS Code</label>
              <input
                value={editData.cricosCode}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    cricosCode: e.target.value,
                  })
                }
              />
            </div>

          </div>

          {/* ================= ACTION BUTTONS ================= */}
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

export default CourseDetails;