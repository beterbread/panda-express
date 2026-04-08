import "./styles/Complete.css";
import { useContext, useEffect, useState, useRef } from "react";
import { PageContext } from "./CustomerView";
import { Link } from "react-router-dom";
import axios from "axios";
import { Translate } from "../Translation/TranslationWrapper";

function Complete() {
  const { setPage } = useContext(PageContext);
  const [timeLeft, setTimeLeft] = useState(30);
  const [orderId, setOrderId] = useState(null);
  const linkRef = useRef(null);

  useEffect(() => {
    setPage("Complete");
  }, [setPage]);

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/latest`
        );
        console.log("order_id:", response.data.order_id);
        console.log("Full response:", response.data);
        setOrderId(response.data.order_id);
      } catch (error) {
        console.error("Error fetching latest order_id:", error);
      }
    };

    fetchOrderId();
  }, [setPage]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      linkRef.current.click();
    }
  }, [timeLeft]);

  return (
    <div className="main-container" id="complete-container">
      <h1 className="subTitle" id="order-complete-heading">
        <Translate>Your Order is Complete</Translate>
      </h1>

      <p
        className="smaller-subTitle"
        id="confirmation-number-text"
        aria-live="assertive" // Ensures screen reader announces confirmation number change immediately
      >
        <Translate>Your confirmation number is</Translate> {orderId}!
      </p>

      <Link to="/kiosk/registration">
        <button
          className="default-button-black smaller-subTitle"
          id="finish-button"
          aria-label="Finish order and return to registration" // Describes the button's action
        >
          <Translate>FINISH</Translate>
        </button>
      </Link>

      <h2 className="subTitle" id="timeLeft-text">
        <span aria-live="polite">{timeLeft}s...</span>
      </h2>

      <p aria-live="polite">
        <Translate>until screen clears...</Translate>
      </p>

      <Link
        to="/kiosk/registration"
        ref={linkRef}
        style={{ display: "none" }}
        aria-label="Automatic redirection after timeout"
      >
        <Translate>Redirect</Translate>
      </Link>
    </div>
  );
}

export default Complete;
