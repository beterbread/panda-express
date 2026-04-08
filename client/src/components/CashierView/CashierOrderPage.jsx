import React, { useContext, useEffect, useState } from 'react';
import { MealTypeContext } from './CashierView';
import DynamicItemButtons from './DynamicItemButtons'; 
import MenuButtons from './MenuButtons';
import Cart from './Cart';
import './styles/CashierOrderPage.css';



function CashierOrderPage() {
    const { mealType, setMealType } = useContext(MealTypeContext);

    return (
        <>
        <div id='POS-container'>

            <div id='POS-menu-container'>
                <div id='POS-cart'>
                    <Cart/>
                </div>
            </div>

            <div id='POS-menu-buttons'>
                <div id='POS-items-buttons'>
                    {mealType !== '' && <DynamicItemButtons/>}
                </div>
                {mealType === '' && <MenuButtons/>}
            </div>

        </div>
        </>

    );
}

export default CashierOrderPage;