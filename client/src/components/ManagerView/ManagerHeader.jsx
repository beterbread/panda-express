import "./styles/ManagerHeader.css";
import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HomeIcon from "../../assets/home_icon.png";
import PandaIcon from "../../assets/panda_icon.png";
import Profile from "../../assets/profile_icon.png";
import { ManagerIdContext } from "./ManagerView";
import { Translate } from "../Translation/TranslationWrapper";

function ManagerHeader() {
  const { managerId, setManagerId } = useContext(ManagerIdContext);
  const [managerName, setManagerName] = useState("");
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const popupRef = useRef(null);

  // Fetch manager name on component mount if managerId is available
  useEffect(() => {
    const fetchManagerName = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/manager/${managerId}`,
        );
        if (response.data && response.data.name) {
          setManagerName(response.data.name); // Set the manager's name
        }
      } catch (error) {
        console.error("Failed to fetch manager data:", error);
      }
    };
    fetchManagerName();
  }, [managerId]);

  const togglePopup = () => {
    setShowAccountPopup((prev) => !prev);
  };

  const handleLogout = () => {
    setManagerId(null); // Clear managerId on logout
    setShowAccountPopup(false); // Close the popup
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowAccountPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        <img className="logo" id="panda_logo" src={PandaIcon} alt="Logo" />
        <h1 class = "header_title"><Translate>Manager View</Translate></h1>
      </div>
      <div className="manager-header-buttons-container">
          <Link to="/manager/statistics">
            <button className="manager-header-buttons"><Translate>Stats & Charts</Translate></button>
          </Link>
          <Link to="/manager/inventory">
            <button className="manager-header-buttons"><Translate>Inventory</Translate></button>
          </Link>
          <Link to="/manager/update">
            <button className="manager-header-buttons"><Translate>Add/Update Items</Translate></button>
          </Link>
          <Link to="/manager/employees">
            <button className="manager-header-buttons"><Translate>Employees</Translate></button>
          </Link>
          <Link to="/manager/allergens">
            <button className="manager-header-buttons"><Translate>Allergens</Translate></button>
          </Link>
        </div>
      <div className="header-right">
        <Link to="/">
          <img src={HomeIcon} alt="Home" className="icon" />
        </Link>
        <img src={Profile} alt="Profile" className="icon" onClick={togglePopup} />

        {showAccountPopup && (
          <div ref={popupRef} className="account-popup">
            <p><Translate>Welcome,</Translate> {managerName}!</p>
            <Link to="/">
              <button onClick={handleLogout}><Translate>Log Out</Translate></button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerHeader;
