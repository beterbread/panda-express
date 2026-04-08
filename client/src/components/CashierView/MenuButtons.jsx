import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported
import axios from 'axios';
import { MealTypeContext, EntreeContext, SideContext } from './CashierView';
import './styles/POSMenuButtons.css';



function MenuButtons() {
 
    const [menuItems, setMenuItems] = useState([]);
    const { mealType, setMealType } = useContext(MealTypeContext);
    const {entreeCount, setEntreeCount} = useContext(EntreeContext);
    const {sideCount, setSideCount} = useContext(SideContext);


    const mealTypeMapping = {
      "Bowl": { entrees: 1, sides: 1 },
      "Plate": { entrees: 2, sides: 1 },
      "Bigger Plate": { entrees: 3, sides: 1 },
      "A La Carte":  { entrees: -1, sides: -1 },
      "Appetizers":  { entrees: -2, sides: -2 },
      "Drinks":  { entrees: -3, sides: -3 },

      // add more meal is needed BUT We operate under the assumption its always the same
    };


    useEffect(() => {
        async function fetchMenuItems() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/menu`);
                setMenuItems(response.data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        }
        fetchMenuItems();
    }, []);

    
    const handleMealTypeClick = (mealName) => {
        setMealType(mealName);
        const mealConfig = mealTypeMapping[mealName];
        setEntreeCount(mealConfig.entrees)
        setSideCount(mealConfig.sides)
    };

    return (
        <div className="menu">
          <div className="POS-button-container">
            {menuItems.map((item, index) => {
                return (
                  <div key={index}>
                    <button 
                      className="menu-button" 
                      onClick={() => handleMealTypeClick(item.meal_name)}>
                          <div className="button-text">
                            {item.meal_name}
                          </div>
                    </button>
                  </div>
                );
            })}
        </div>
      </div>
    );
}

export default MenuButtons;
