import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";

const FormActions = ({
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
  disableSave = false,
}) => {
  return (
    <div className="form-actions">
      <button
        type="submit"
        className="btn-save"
        onClick={onSave}
        disabled={disableSave}
      >
        <FontAwesomeIcon icon={faFloppyDisk} /> {saveText}
      </button>

      <button
        type="button"
        className="btn-cancel"
        onClick={onCancel}
      >
        <FontAwesomeIcon icon={faXmark} /> {cancelText}
      </button>
    </div>
  );
};

export default FormActions;
