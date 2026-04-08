import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CustomerIdContext, PageContext } from "./CustomerView";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google"; 
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./styles/Registration.css";
import { Translate } from "../Translation/TranslationWrapper";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function Registration() {
  const { setCustomerId } = useContext(CustomerIdContext);
  const { setPage } = useContext(PageContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [setting, setSetting] = useState(location.state?.setting || "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPage("Registration");
  }, [setPage]);

  useEffect(() => {
    if (location.state?.setting) {
      setSetting(location.state.setting);
    }
  }, [location.state]);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleGoogleSignIn = async (response) => {
    if (response.credential) {
      try {
        const googleData = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/customer/google-signin`,
          { token: response.credential },
        );

        if (googleData.data.customer_id) {
          setCustomerId(googleData.data.customer_id);
          navigate("/kiosk/menu");
        }
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("An error occurred while signing in with Google.");
        }
      }
    }
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/customer/login`,
        { email, password },
      );
      if (response.data.customer_id) {
        setCustomerId(response.data.customer_id);
        navigate("/kiosk/menu");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred while logging in.");
    }
  };

  const handleSignUp = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/customer/register`,
        { firstName, lastName, email, password },
      );
      if (response.data.customer_id) {
        setCustomerId(response.data.customer_id);
        navigate("/kiosk/menu");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred while signing up.");
    }
  };

  function changeSetting(newSetting) {
    setError("");
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setSetting(newSetting);
  }

  return (
    <div className="main-container" id="registration-main-container">
      <div className="registration">
        <div className="buttons-container">
          <button
            className="default-button-red smaller-subTitle"
            id="login-button"
            onClick={() => changeSetting("login")}
            aria-label="Log in to your account"
          >
            <Translate>Log In</Translate>
          </button>
          <button
            className="default-button-red smaller-subTitle"
            id="signup-button"
            onClick={() => changeSetting("signup")}
            aria-label="Create a new account"
          >
            <Translate>Sign Up</Translate>
          </button>
        </div>

        {setting === "login" ? (
          <div className="red-container" id="registration-red-container">
            <h1 className="subTitle" id="login-title">
              <Translate>Log in to grub</Translate>
            </h1>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Enter your email address"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Enter your password"
            />
            {error && <p className="error"><Translate>{error}</Translate></p>}

            <div id="google-login">
              <GoogleOAuthProvider clientId={CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSignIn}
                  onError={() => setError("Google sign-in failed.")}
                  useOneTap
                  aria-label="Log in with Google"
                />
              </GoogleOAuthProvider>
            </div>

            <div id="login-buttons-container">
              <button
                className="default-button-black smaller-subTitle"
                id="registration-button-black"
                onClick={handleLogin}
                aria-label="Submit login form"
              >
                <Translate>Log in</Translate>
              </button>
              <Link to="/kiosk/menu">
                <button
                  className="default-button-black smaller-subTitle"
                  id="registration-button-black"
                  aria-label="Continue as guest"
                >
                  <Translate>Guest</Translate>
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="red-container" id="registration-red-container">
            <h1 className="subTitle" id="signin-title">
              <Translate>Create an account</Translate>
            </h1>
            <div className="name-container">
              <input
                id="firstname-input"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                aria-label="Enter your first name"
              />
              <input
                id="lastname-input"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                aria-label="Enter your last name"
              />
            </div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Enter your email address"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Enter your password"
            />
            {error && <p className="error"><Translate>{error}</Translate></p>}

            <div id="google-login">
              <GoogleOAuthProvider clientId={CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSignIn}
                  onError={() => setError("Google sign-in failed.")}
                  useOneTap
                  aria-label="Sign up with Google"
                />
              </GoogleOAuthProvider>
            </div>

            <button
              className="default-button-black smaller-subTitle"
              id="registration-button-black"
              onClick={handleSignUp}
              aria-label="Submit sign-up form"
            >
              <Translate>Sign up</Translate>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Registration;
