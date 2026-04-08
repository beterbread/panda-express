import "./App.css";
import { Link } from "react-router-dom";
import Logo from "./assets/panda_express_logo.png";
import WeatherIcon from "./assets/weather_icon.png";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { LanguageToggle } from "./components/Translation/LanguageToggle";
import { Translate } from "./components/Translation/TranslationWrapper";

/* Credit to this user for the animations : https://lottiefiles.com/vdr0uy2wwsoljqtc */
// Animations
import CloudyNight from "./assets/animations/cloudy-night.json";
import Cloudy from "./assets/animations/cloudy.json";
import Foggy from "./assets/animations/foggy.json";
import Mist from "./assets/animations/mist.json";
import Night from "./assets/animations/night.json";
import PartlyCloudy from "./assets/animations/partly-cloudy.json";
import PartlyShower from "./assets/animations/partly-shower.json";
import RainyNight from "./assets/animations/rainy-night.json";
import SnowNight from "./assets/animations/snow-night.json";
import SnowSunny from "./assets/animations/snow-sunny.json";
import Snow from "./assets/animations/snow.json";
import StormShowers from "./assets/animations/storm-showers.json";
import Storm from "./assets/animations/storm.json";
import Sunny from "./assets/animations/sunny.json";
import Thunder from "./assets/animations/thunder.json";

function App() {
  const [weather, setWeather] = useState(null);
  const [showWidget, setShowWidget] = useState(false);
  const weatherWidgetRef = useRef(null);
  const weatherIconRef = useRef(null);
  const navRef = useRef(null);

  // Fetch weather data from the server
  const getWeather = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/weather`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  };

  const getWeatherAnimation = (condition, isDay) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return Sunny;
      case "clear":
        return isDay ? Sunny : Night;
      case "partly cloudy":
        return isDay ? PartlyCloudy : CloudyNight;
      case "cloudy":
        return Cloudy;
      case "overcast":
        return Foggy;
      case "mist":
      case "fog":
      case "freezing fog":
        return Mist;
      case "patchy rain possible":
      case "patchy freezing drizzle possible":
      case "patchy light drizzle":
      case "light drizzle":
      case "freezing drizzle":
      case "heavy freezing drizzle":
      case "patchy light rain":
      case "light rain":
      case "moderate rain at times":
      case "moderate rain":
      case "heavy rain at times":
      case "heavy rain":
      case "light freezing rain":
      case "moderate or heavy freezing rain":
      case "light rain shower":
      case "moderate or heavy rain shower":
      case "torrential rain shower":
        return isDay ? PartlyShower : RainyNight;
      case "patchy snow possible":
      case "patchy sleet possible":
      case "blowing snow":
      case "light sleet":
      case "moderate or heavy sleet":
      case "patchy light snow":
      case "light snow":
      case "patchy moderate snow":
      case "moderate snow":
      case "patchy heavy snow":
      case "heavy snow":
      case "ice pellets":
      case "light sleet showers":
      case "moderate or heavy sleet showers":
      case "light snow showers":
      case "moderate or heavy snow showers":
      case "light showers of ice pellets":
      case "moderate or heavy showers of ice pellets":
        return isDay ? SnowSunny : SnowNight;
      case "thundery outbreaks possible":
        return Thunder;
      case "patchy light rain with thunder":
      case "moderate or heavy rain with thunder":
        return isDay ? StormShowers : Storm;
      case "patchy light snow with thunder":
      case "moderate or heavy snow with thunder":
      case "blizzard":
        return Snow;
    }
  };

  useEffect(() => {
    getWeather().then((data) => setWeather(data));

    // Event listener to detect clicks outside the weather widget
    const handleClickOutside = (event) => {
      if (
        weatherWidgetRef.current &&
        !weatherWidgetRef.current.contains(event.target) &&
        weatherIconRef.current &&
        !weatherIconRef.current.contains(event.target) &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setShowWidget(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="app">
      <header>
        {/* Weather icon */}
        <div
          className="weather-icon"
          ref={weatherIconRef}
          onClick={() => setShowWidget(!showWidget)}
          role="button"
          aria-label="Toggle weather widget"
          tabIndex="0"
          onKeyDown={(e) => e.key === "Enter" && setShowWidget(!showWidget)} // Keyboard navigation
        >
          {weather && <img src={WeatherIcon} alt="Weather Icon" />}
        </div>

        {/* Weather widget */}
        {showWidget && weather && (
          <div
            className="weather-widget"
            ref={weatherWidgetRef}
            role="dialog"
            aria-labelledby="weather-widget-title"
            aria-hidden={!showWidget}
            tabIndex="0"
          >
            <h3 id="weather-widget-title">
              <Translate>{weather.location}</Translate>
            </h3>
            <Lottie
              animationData={getWeatherAnimation(
                weather.condition.text,
                weather.is_day
              )}
              loop={true}
              autoplay={true}
              style={{ width: 100, height: 100 }}
            />
            <p>
              <Translate>{weather.condition.text}</Translate>
            </p>
            <p>🌡️ {weather.temp}°F</p>
            <p>
              💨 {weather.wind_dir} <Translate>at</Translate> {weather.wind_mph} mph
            </p>
            <p>💧 <Translate>Humidity:</Translate> {weather.humidity}%</p>
          </div>
        )}

        {/* Main body */}
        <img className="logo" src={Logo} alt="Panda Express Logo" />
        <nav ref={navRef}>
          <Link to="kiosk/registration">
            <button tabIndex="0">
              <Translate>Start Order</Translate>
            </button>
          </Link>
          <Link to="cashier/registration">
            <button tabIndex="0">
              <Translate>Employee Login</Translate>
            </button>
          </Link>
          <Link to="manager/registration">
            <button tabIndex="0">
              <Translate>Manager Login</Translate>
            </button>
          </Link>
          <Link to="menu">
            <button tabIndex="0">
              <Translate>Menu</Translate>
            </button>
          </Link>
        </nav>

        {/* Translate Button */}
        <LanguageToggle className="translate-button" />
      </header>
    </div>
  );
}

export default App;
