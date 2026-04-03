import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faCheck,
  faTrash,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import FormActions from "../../components/FormActions";
import "../../assets/styles/style.css";

const INITIAL_ITEMS = [
  { id: 1, label: "Colour copy of the passport", checked: false, isEditing: false },
  { id: 2, label: "English score report", checked: false, isEditing: false },
  { id: 3, label: "Current COE", checked: false, isEditing: false },
  { id: 4, label: "IMMI Grant Notification", checked: false, isEditing: false },
  { id: 5, label: "Marriage Certificate (If applicable)", checked: false, isEditing: false },
  {
    id: 6,
    label:
      "Australian Qualifications - Award Certificates, Transcripts and Completion letters and Up to date transcripts (If currently following any program)",
    checked: false,
    isEditing: false,
  },
  {
    id: 7,
    label: "Overseas Qualification - A/L , O/L , Certificates, Diploma",
    checked: false,
    isEditing: false,
  },
  {
    id: 8,
    label: "Home Country Address (Postcode / Province / Suburb)",
    checked: false,
    isEditing: false,
  },
  {
    id: 9,
    label:
      "Emergency Contact details:\n" +
      "• Name\n" +
      "• Relationship\n" +
      "• Contact Number\n" +
      "• Email\n" +
      "• Address (Suburb / State / Province / Postcode / Country)",
    checked: false,
    isEditing: false,
  },
  { id: 10, label: "USI", checked: false, isEditing: false },
  { id: 11, label: "OSHC", checked: false, isEditing: false },
  {
    id: 12,
    label:
      "Have you had any previous visa rejections or cancellations (from any country)?",
    checked: false,
    isEditing: false,
  },
];

const EnrolmentChecklist = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const toggleCheck = (index) => {
    const updated = [...items];
    updated[index].checked = !updated[index].checked;
    setItems(updated);
  };

  const enableEdit = (index) => {
    const updated = [...items];
    updated[index].isEditing = true;
    setItems(updated);
  };

  const updateLabel = (index, value) => {
    const updated = [...items];
    updated[index].label = value;
    setItems(updated);
  };

  const saveEdit = (index) => {
    const updated = [...items];
    updated[index].isEditing = false;
    setItems(updated);
  };

  const addItem = () => {
    const newId = items.length ? items[items.length - 1].id + 1 : 1;
    setItems([
      ...items,
      { id: newId, label: "", checked: false, isEditing: true },
    ]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log("Checklist submitted:", items);
    alert("Checklist saved");
  };

  const handleCancel = () => {
    setItems(INITIAL_ITEMS);
  };

  return (
    <div className="container-full">
      <div className="content-header">
        <h2>ENROLMENT CHECK LIST</h2>

        <p className="sub-title">
          <span>
            <FontAwesomeIcon icon={faHome} className="home" /> - Forms
          </span>{" "}
          - General Form Elements
        </p>

        <div className="list-form-content">
          <div className="checklist-toolbar">
            <button type="button" className="btn-add" onClick={addItem}>
              <FontAwesomeIcon icon={faPlus} /> Add Item
            </button>
          </div>

          <div className="checklist-grid">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`checklist-card ${item.checked ? "checked" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(index)}
                />

                {item.isEditing ? (
                  <input
                    type="text"
                    value={item.label}
                    autoFocus
                    onChange={(e) => updateLabel(index, e.target.value)}
                    onBlur={() => saveEdit(index)}
                    className="checklist-input"
                  />
                ) : (
                  <span style={{ whiteSpace: "pre-line" }}>
                    {item.label}
                  </span>
                )}

                <div className="card-actions">
                  {item.isEditing ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="edit-icon"
                      onClick={() => saveEdit(index)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faPen}
                      className="edit-icon"
                      onClick={() => enableEdit(index)}
                    />
                  )}

                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-icon"
                    onClick={() => removeItem(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          <FormActions onSave={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default EnrolmentChecklist;
