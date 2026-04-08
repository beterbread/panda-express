import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CashierIdContext, PageContext } from "./CashierView";
import axios from "axios";

function Registration() {
  const { setCashierId } = useContext(CashierIdContext);
  const { setPage } = useContext(PageContext);
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPage("registration");
  }, []);

  const handleLogin = async () => {
    if (!id.trim()) {
      setError("Please enter your Employee ID.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cashier/login`,
        {
          employeeId: id.trim(), // Ensure it matches the backend logic
        },
      );
      if (response.data.cashier_id) {
        setCashierId(response.data.cashier_id);
        setPage(""); // CHANGE LATER
        navigate("/cashier/order"); // Redirect after successful login
      }
    } catch (err) {
      if (err.response) {
        // Handle different error statuses from the backend
        if (err.response.status === 400) {
          setError(err.response.data.error); // Invalid Employee ID format
        } else if (err.response.status === 401) {
          setError("Invalid manager ID or not authorized.");
        } else {
          setError("An error occurred while logging in. Please try again.");
        }
      } else {
        setError("Network error: Unable to reach the server.");
      }
    }
  };

  return (
    <div className="main-container" id="registration-main-container">
      <div className="registration">
        <div className="red-container" id="registration-red-container">
          <h1 className="subTitle" id="login-title">
            Log in to cashier
          </h1>
          <input
            placeholder="Employee ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="login-input"
          />
          {error && <p className="error">{error}</p>}{" "}
          {/* Display error message */}
          <button
            className="default-button-black smaller-subTitle"
            id="registration-button-black"
            onClick={handleLogin}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registration;
