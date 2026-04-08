import "./styles/CustomerHeader.css";
import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cart from "../../assets/cart_icon.png";
import HomeIcon from "../../assets/home_icon.png";
import PandaIcon from "../../assets/panda_icon.png";
import Profile from "../../assets/profile_icon.png";
import { CustomerIdContext, PageContext } from "./CustomerView";
import { Translate } from "../Translation/TranslationWrapper";

function Header() {
  const { page } = useContext(PageContext);
  const { customerId, setCustomerId } = useContext(CustomerIdContext);
  const [customerName, setCustomerName] = useState("");
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const popupRef = useRef(null);

  // Fetch customer name if customerId is not -1
  useEffect(() => {
    if (customerId !== -1) {
      const fetchCustomer = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/customer`
          );
          const customers = await response.data;
          const customer = customers.find((c) => c.customer_id === customerId);
          if (customer) {
            setCustomerName(customer.customer_name);
          }
        } catch (error) {
          console.error("Failed to fetch customer data:", error);
        }
      };
      fetchCustomer();
    }
  }, [customerId]);

  const togglePopup = () => {
    setShowAccountPopup((prev) => !prev);
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

  const closePopup = () => {
    setShowAccountPopup(false);
  };

  return (
    <div className="header">
      <div className="header-left">
        <img
          className="logo"
          id="panda_logo"
          src={PandaIcon}
          alt="Logo"
          tabIndex="0"
          aria-label="Panda Express logo"
        />
        <h1 id="page_title">{page}</h1>
      </div>

      <div className="header-right">
        <Link to="/" tabIndex="0" aria-label="Home page">
          <img src={HomeIcon} alt="Home" className="icon" />
        </Link>
        <Link to="/kiosk/cart" tabIndex="0" aria-label="View cart">
          <img src={Cart} alt="Cart" className="icon" />
        </Link>
        <img
          src={Profile}
          alt="Profile"
          className="icon"
          onClick={togglePopup}
          tabIndex="0"
          role="button"
          aria-label="Profile menu"
          onKeyDown={(e) => e.key === "Enter" && togglePopup()} // Allow toggling via Enter key
        />

        {showAccountPopup && (
          <div
            ref={popupRef}
            className="account-popup"
            role="dialog"
            aria-labelledby="account-popup-title"
            aria-hidden={!showAccountPopup}
            tabIndex="-1" // Make popup focusable for keyboard navigation
          >
            {customerId === -1 ? (
              <>
                <p><Translate>Get points for your order!</Translate></p>
                <Link
                  to="/kiosk/registration"
                  state={{ setting: "signup" }}
                  onClick={closePopup}
                  tabIndex="0"
                  aria-label="Sign up for an account"
                >
                  <button tabIndex="0"><Translate>Sign Up</Translate></button>
                </Link>
                <Link
                  to="/kiosk/registration"
                  state={{ setting: "login" }}
                  onClick={closePopup}
                  tabIndex="0"
                  aria-label="Log in to your account"
                >
                  <button tabIndex="0"><Translate>Log In</Translate></button>
                </Link>
              </>
            ) : (
              <>
                <p><Translate>Welcome,</Translate> {customerName}!</p>
                <Link
                  to="/"
                  onClick={closePopup}
                  tabIndex="0"
                  aria-label="Log out of your account"
                >
                  <button tabIndex="0"><Translate>Log Out</Translate></button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
