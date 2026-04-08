import React, { useEffect, useState } from "react";
import "./styles/NutritionPopup.css";
import axios from "axios";
import { Translate } from "../Translation/TranslationWrapper.jsx";

function NutritionPopup({ item_id, onClose }) {
  const [nutritionData, setNutritionData] = useState(null);
  const [allergenData, setAllergenData] = useState("");

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/item/nutrition?item_id=${item_id}`
        );
        setNutritionData(response.data); // Use response.data directly
      } catch (error) {
        console.error("Error fetching nutrition data:", error);
      }
    };

    fetchNutritionData();
  }, [item_id]);

  useEffect(() => {
    const fetchAllergenData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/item/allergen?item_id=${item_id}`
        );
        const data = response.data;
        if (Array.isArray(data)) {
          const allergenList = data
            .map((item) => item.allergen_name)
            .join(", ");
          setAllergenData(allergenList);
        } else {
          setAllergenData("No Common Allergens");
        }
      } catch (error) {
        console.error("Error fetching allergen data:", error);
      }
    };

    fetchAllergenData();
  }, [item_id]);

  return (
    <div className="nutrition-popup-overlay" role="dialog" aria-labelledby="nutrition-popup-title" aria-describedby="nutrition-popup-description">
      <div className="nutrition-popup">
        <button onClick={onClose} aria-label="Close Nutrition Information">X</button>
        <header>
          <h2 id="nutrition-popup-title">
            <Translate>Nutrition Info</Translate>
          </h2>
        </header>

        {nutritionData ? (
          <main id="nutrition-popup-description">
            <ul>
              <li className="allergens">
                <Translate>Allergens:</Translate> {allergenData}
              </li>
              <li>
                <span><Translate>Calories:</Translate></span> <span>{nutritionData.calories} cal</span>
              </li>
              <li>
                <span><Translate>Total Fat:</Translate></span> <span>{nutritionData.total_fat} g</span>
              </li>
              <li>
                <span><Translate>Cholesterol:</Translate></span> <span>{nutritionData.cholesterol} mg</span>
              </li>
              <li>
                <span><Translate>Sodium:</Translate></span> <span>{nutritionData.sodium} mg</span>
              </li>
              <li>
                <span><Translate>Total Carbs:</Translate></span> <span>{nutritionData.total_carb} g</span>
              </li>
              <li>
                <span><Translate>Protein:</Translate></span> <span>{nutritionData.protein} g</span>
              </li>
              <li>
                <span><Translate>Serving Size:</Translate></span> <span>{nutritionData.serving_size} oz</span>
              </li>
            </ul>
          </main>
        ) : (
          <p aria-live="assertive">
            <Translate>Loading nutrition data...</Translate>
          </p>
        )}
      </div>
    </div>
  );
}

export default NutritionPopup;
