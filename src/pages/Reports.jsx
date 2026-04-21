import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTable } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/style.css";

const Reports = () => (
  <div className="container-full">
    <div className="content-header">
      <h2>Reports</h2>
      <p className="sub-title">
        <span>
          <FontAwesomeIcon icon={faHome} className="home" /> Dashboard
        </span>{" "}
        — open a data view
      </p>
    </div>

    <div className="quick-actions" style={{ marginTop: 16 }}>
      <Link to="/courses" className="qa-btn">
        <FontAwesomeIcon icon={faTable} style={{ marginRight: 8 }} />
        View courses
      </Link>
      <Link to="/agreement" className="qa-btn">
        View agreements / colleges
      </Link>
      <Link to="/enrolment" className="qa-btn">
        View enrolments
      </Link>
      <Link to="/flyer" className="qa-btn">
        View flyers
      </Link>
      <Link to="/enrolmentchecklist" className="qa-btn">
        Enrolment checklist
      </Link>
    </div>
  </div>
);

export default Reports;
