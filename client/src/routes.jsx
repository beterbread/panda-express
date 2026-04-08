import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// To do later
import MenuView from './components/MenuView/MenuView.jsx';

// CustomerView components
import CustomerView from './components/CustomerView/CustomerView.jsx';

import Complete from './components/CustomerView/Complete.jsx';
import MealType from './components/CustomerView/MealType.jsx';
import Menu from './components/CustomerView/Menu.jsx';
import Order from './components/CustomerView/Order.jsx';
import Payment from './components/CustomerView/Payment.jsx';
import CustomerRegistration from './components/CustomerView/Registration.jsx';

// ManagerView components
import ManagerView from './components/ManagerView/ManagerView.jsx';

import Statistics from './components/ManagerView/Statistics.jsx';
import Inventory from './components/ManagerView/Inventory.jsx';
import Update from './components/ManagerView/Update.jsx';
import Employees from './components/ManagerView/Employees.jsx';
import ManagerRegistration from './components/ManagerView/Registration.jsx';

// CashierView Components
import CashierView from './components/CashierView/CashierView.jsx';
import CashierRegistration from './components/CashierView/Registration.jsx';
import CashierOrderPage from './components/CashierView/CashierOrderPage.jsx';
import CashierPayment from './components/CashierView/CashierPayment.jsx';
import Allergens from './components/ManagerView/Allergens.jsx';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/cashier",
    element: <CashierView />,
    children: [
      {
        path: "registration",
        element: <CashierRegistration />,
      },
      {
        path: "order",
        element: <CashierOrderPage/>
      },
      {
        path: "pay",
        element: <CashierPayment/>
      }
    ]
  },
  {
    path: "/kiosk",
    element: <CustomerView />,
    children: [
      {
        path: "complete",
        element: <Complete />,
      },
      {
        path: "mealtype",
        element: <MealType />,
      },
      {
        path: "menu",
        element: <Menu />,
      },
      {
        path: "cart",
        element: <Order />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "registration",
        element: <CustomerRegistration />,
      },
    ],
  },
  {
    path: "/manager",
    element: <ManagerView />,
    children: [
      {
        path: "statistics",
        element: <Statistics />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "update",
        element: <Update />,
      },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "registration",
        element: <ManagerRegistration />,
      },
      {
        path: "allergens",
        element: <Allergens />,
      },
    ],
  },
  {
    path: "/menu",
    element: <MenuView />,
  },
]);

export default routes;
