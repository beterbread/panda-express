import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MenuView.css';
import bowlImage from '../../assets/meals/bowl.png';
import plateImage from '../../assets/meals/plate.png';
import biggerPlateImage from '../../assets/meals/bigger-plate.png';
import newImage from '../../assets/panda_express_logo.png';

function MenuView() {
  const [menuItems, setMenuItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const containerRef = useRef(null);
  const [images, setImages] = useState({});

    useEffect(() => {
        const loadImages = async () => {
            const imageImports = {};
            imageImports[0] = await import(`../../assets/items/0.png`);
            for (let i = 1; i <= 24; i++) {
                try {
                    imageImports[i] = await import(`../../assets/items/${i}.png`);
                } catch (error) {
                    console.warn(`Image for item ${i} not found. Using default.`);
                    imageImports[i] = imageImports[0]; 
                }
            }
            setImages(imageImports);
        };
    
        loadImages();
    }, []);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/allMenuInfo`);
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }
    fetchMenuItems();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/item`);
        setAllItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }
    fetchItems();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      let scrollAmount = 0;
      const scrollStep = 1.25;

      const animate = () => {
        if (scrollAmount >= container.scrollHeight / 2) {
          scrollAmount = 0;
        } else {
          scrollAmount += scrollStep;
        }
        container.scrollTop = scrollAmount;
        requestAnimationFrame(animate);
      };

      const frameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, []); // Ensure animation starts after data is loaded

  function getItemImage(item) {
    if (!item || !item.item_id) return images[0]?.default || '';
    return images[item.item_id]?.default || images[0]?.default || '';
}

  function getPrice(mealName) {
    const item = menuItems.find(item => item.meal_name === mealName);
    return item ? item.price : "Price not available";
  }

  function getSizePrice(mealName, mealSize) {
    const item = menuItems.find(item => item.meal_name === mealName && item.meal_size === mealSize);
    return item ? item.price : "Price not available";
  }

  function getTypeSizePrice(mealName, mealSize, mealType) {
    const item = menuItems.find(item => item.meal_name === mealName && item.meal_size === mealSize && item.meal_type === mealType);
    return item ? item.price : "Price not available";
  }

  function getEntreeItems() {
    return allItems.filter(item => item.item_category === 'Entree');
  }

  function getSideItems() {
    return allItems.filter(item => item.item_category === 'Side');
  }

  function getAppetizerItems() {
    return allItems.filter(item => item.item_category === 'Appetizers');
  }

  function getDrinkItems() {
    return allItems.filter(item => item.item_category === 'Drinks');
  }

  function getCalorieRange(items) {
    if (!items || items.length === 0) return "0-0 cal";
    const calories = items.map(item => item.calories);
    const minCalories = Math.min(...calories);
    const maxCalories = Math.max(...calories);
    return `${minCalories}-${maxCalories} cal`;
  }

  const mealSets = [
    { image: bowlImage, name: 'BOWL', description: '1 Side & 1 Entree', priceKey: 'Bowl' },
    { image: plateImage, name: 'PLATE', description: '1 Side & 2 Entrees', priceKey: 'Plate' },
    { image: biggerPlateImage, name: 'BIGGER PLATE', description: '1 Side & 3 Entrees', priceKey: 'Bigger Plate' }
  ];

  return (
    <div className="background">
      <div className="animation-container" ref={containerRef}>
        {[1, 2].map((_, duplicateIndex) => (
          <React.Fragment key={duplicateIndex}>
            {/* PICK A MEAL Section */}
            <div className="outer-box">
              <h1 className="title">PICK A MEAL</h1>
              <div className="inner-box">
                {mealSets.map((meal, index) => (
                  <div className="menu-item" key={`${duplicateIndex}-${index}`}>
                    <div>
                      <img src={meal.image} alt={meal.name} className="meal-image" />
                      <div className="text-container">
                        <strong>{meal.name}</strong>
                        <p>{meal.description}</p>
                      </div>
                    </div>
                    <span>${getPrice(meal.priceKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ENTREES Section */}
            <div className="outer-box">
              <h1 className="title">ENTREES</h1>
              <div className="inner-box-entrees">
                {getEntreeItems().map(item => (
                  <div className="menu-item" key={`${duplicateIndex}-${item.id}`}>
                    <div>
                      <img src={getItemImage(item)} alt={item.item_name} className="meal-image" />
                      <div className="text-container">
                        <strong>{item.item_name}</strong>
                        <p className="extra-charge">{item.extra_charge > 0 ? `+$${item.extra_charge}` : null}</p>
                      </div>
                    </div>
                    <span>{item.calories} cal</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SIDES and A LA CARTE Section */}
            <div className="nested-box">
              <div className="nested-outer-box">
                <h1 className="title">SIDES</h1>
                <div className="inner-box">
                  {getSideItems().map(item => (
                    <div className="menu-item" key={`${duplicateIndex}-${item.id}`}>
                      <div>
                        <img src={getItemImage(item)} alt={item.item_name} className="meal-image" />
                        <div className="text-container">
                          <strong>{item.item_name}</strong>
                          <p className="extra-charge">{item.extra_charge > 0 ? `+$${item.extra_charge}` : null}</p>
                        </div>
                      </div>
                      <span>{item.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="nested-outer-box">
                <h1 className="title">A LA CARTE</h1>
                <div className="inner-box-size">
                  <div className="section">
                    <h2>ENTREES</h2>
                    <ul>
                      <li><span>Small</span><span>${getTypeSizePrice("A La Carte", "Small", "Entree")}</span></li>
                      <li><span>Medium</span><span>${getTypeSizePrice("A La Carte", "Medium", "Entree")}</span></li>
                      <li><span>Large</span><span>${getTypeSizePrice("A La Carte", "Large", "Entree")}</span></li>
                    </ul>
                    <p className="calories">{getCalorieRange(getEntreeItems())}</p>
                  </div>
                  <hr></hr>
                  <div className="section">
                    <h2>SIDES</h2>
                    <ul>
                      <li><span>Medium</span><span>${getTypeSizePrice("A La Carte", "Medium", "Side")}</span></li>
                      <li><span>Large</span><span>${getTypeSizePrice("A La Carte", "Large", "Side")}</span></li>
                    </ul>
                    <p className="calories">{getCalorieRange(getSideItems())}</p>
                  </div>
                  {/*<img src={newImage} alt="Bowl" className="meal-image2"/>*/}
                </div>
              </div>
            </div>

            {/* APPETIZERS and DRINKS Section */}
            <div className="nested-box">
              <div className="nested-outer-box">
                <h1 className="title">APPETIZERS</h1>
                <div className="inner-box">
                  {getAppetizerItems().map(item => (
                    <div className="menu-item" key={`${duplicateIndex}-${item.id}`}>
                      <div>
                        <img src={getItemImage(item)} alt={item.item_name} className="meal-image" />
                        <div className="text-container">
                          <strong>{item.item_name}</strong>
                          <p className="extra-charge">{item.extra_charge > 0 ? `+$${item.extra_charge}` : null}</p>
                        </div>
                      </div>
                      <span>{item.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="nested-outer-box">
                <h1 className="title">DRINKS</h1>
                <div className="inner-box">
                  <div className="sizes">
                    <div className="sizeInfo">
                      <h1>Small</h1>
                      <p>${getSizePrice("Drinks", "Small")}</p>
                    </div>
                    <div className="sizeInfo">
                      <h1>Medium</h1>
                      <p>${getSizePrice("Drinks", "Medium")}</p>
                    </div>
                    <div className="sizeInfo">
                      <h1>Large</h1>
                      <p>${getSizePrice("Drinks", "Large")}</p>
                    </div>
                  </div>
                  <hr></hr>
                  {getDrinkItems().map(item => (
                    <div className="menu-item" key={`${duplicateIndex}-${item.id}`}>
                      <div>
                        <img src={getItemImage(item)} alt={item.item_name} className="meal-image" />
                        <div className="text-container">
                          <strong>{item.item_name}</strong>
                          <p className="extra-charge">{item.extra_charge > 0 ? `+$${item.extra_charge}` : null}</p>
                        </div>
                      </div>
                      <span>{item.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default MenuView;
