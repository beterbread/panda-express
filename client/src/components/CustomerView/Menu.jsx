import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Ensure Link is imported
import axios from "axios";
import { MealTypeContext, PageContext } from "./CustomerView";
import "./styles/Menu.css";
import { Translate } from "../Translation/TranslationWrapper";

// Import images
import Error from "../../assets/error.png";
import Plate from "../../assets/meals/plate.png";
import Bowl from "../../assets/meals/bowl.png";
import BiggerPlate from "../../assets/meals/bigger-plate.png";
import Appetizer from "../../assets/meals/appetizers.png";
import ALaCarte from "../../assets/meals/a-la-carte.png";
import Drink from "../../assets/meals/drinks.png";

function Menu() {
  const { page, setPage } = useContext(PageContext);
  const [menuItems, setMenuItems] = useState([]);
  const { mealType, setMealType } = useContext(MealTypeContext);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    setPage("Menu");
  }, [setPage]);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/menu`
        );
        setMenuItems(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    }
    fetchMenuItems();
  }, []);

  // Map meal names to images
  const imageMap = {
    Plate: Plate,
    Bowl: Bowl,
    "Bigger Plate": BiggerPlate,
    Appetizers: Appetizer,
    "A La Carte": ALaCarte,
    Drinks: Drink,
    // Add more mappings as needed
  };

  const handleMealTypeClick = (mealName) => {
    setMealType(mealName);
  };

  // Loading screen component with animation
  if (loading) {
    return (
      <div className="loading-screen" role="alert" aria-live="assertive">
        <div className="spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="menu">
      <div className="button-container">
        {menuItems.map((item, index) => {
          const imagePath = imageMap[item.meal_name] || Error;
          return (
            <Link to="/kiosk/mealtype" key={index} aria-label={`Select ${item.meal_name}`}>
              <button
                className="menu-button"
                onClick={() => handleMealTypeClick(item.meal_name)}
                aria-label={`Select ${item.meal_name}`}
              >
                <img
                  src={imagePath}
                  alt={`Image of ${item.meal_name}`}
                  className="button-image"
                  aria-hidden="true" // Hides the image from screen readers, as it's decorative
                />
                <div className="button-text">
                  <Translate>{item.meal_name}</Translate>
                  <br />
                  <span aria-hidden="true">${item.price}</span>
                </div>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Menu;
