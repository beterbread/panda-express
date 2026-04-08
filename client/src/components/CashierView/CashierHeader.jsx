import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HomeIcon from "../../assets/home_icon.png";
import PandaIcon from "../../assets/panda_icon.png";
import Profile from "../../assets/profile_icon.png";
import { CashierIdContext } from "./CashierView";

function ManagerHeader() {
  const { cashierId, setCashierId } = useContext(CashierIdContext);
  const [cashierName, setCashierName] = useState("");
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const popupRef = useRef(null);

  // Fetch manager name on component mount if managerId is available
  useEffect(() => {
    const fetchCashierName = async () => {
      if (cashierId == -1) {
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cashier/${cashierId}`,
        );
        if (response.data && response.data.name) {
          setCashierName(response.data.name); // Set the cashier's name
        }
      } catch (error) {
        console.error("Failed to fetch cashier data:", error);
      }
    };
    fetchCashierName();
  }, [cashierId]);

  const togglePopup = () => {
    setShowAccountPopup((prev) => !prev);
  };

  const handleLogout = () => {
    setCashierId(null); // Clear managerId on logout
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
        <h1>Cashier View</h1>
      </div>
      <div className="header-right">
        <Link to="/">
          <img src={HomeIcon} alt="Home" className="icon" />
        </Link>
        <img src={Profile} alt="Profile" className="icon" onClick={togglePopup} />

        {showAccountPopup && (
          <div ref={popupRef} className="account-popup">
            <p>Welcome, {cashierName}!</p>
            <Link to="/">
              <button onClick={handleLogout}>Log Out</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerHeader;
