import { useState, createContext } from 'react';
import { Outlet } from 'react-router-dom';
import CashierHeader from './CashierHeader';

export const CashierIdContext = createContext();
export const PageContext = createContext();
export const CartContext = createContext();
export const MealTypeContext = createContext();


//to track entree, side and single item  (alacarte = -1, apps = -2, drinks = -3)
export const EntreeContext = createContext()
export const SideContext = createContext()

function CashierView() {
    const [cashierId, setCashierId] = useState(-1);
    const [page, setPage] = useState('');
    const [mealType, setMealType] = useState('');
    const [cart, setCart] = useState([]);
    const [entreeCount, setEntreeCount] = useState(0);
    const [sideCount, setSideCount] = useState(0);





    return (
      <>
      {/* REFACTORED - previous iteration caused bugs and was too complicated */}

  <PageContext.Provider value={{ page, setPage }}>
  <CashierIdContext.Provider value={{ cashierId, setCashierId }}>
    {page !== 'registration' && <CashierHeader />}
    <main>
      <MealTypeContext.Provider value={{ mealType, setMealType }}>
        <EntreeContext.Provider value={{ entreeCount, setEntreeCount }}>
          <SideContext.Provider value={{ sideCount, setSideCount }}>
            <CartContext.Provider value={{ cart, setCart }}>
              <Outlet />
            </CartContext.Provider>
          </SideContext.Provider>
        </EntreeContext.Provider>
      </MealTypeContext.Provider>
    </main>
  </CashierIdContext.Provider>
</PageContext.Provider>




      </>
    );
}

export default CashierView;
