import "./styles/ManagerView.css";
import { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import ManagerHeader from "./ManagerHeader";

export const ManagerIdContext = createContext();
export const PageContext = createContext();

function ManagerView() {
  const [managerId, setManagerId] = useState(-1);
  const [page, setPage] = useState("");

  return (
    <PageContext.Provider value={{ page, setPage }}>
      <ManagerIdContext.Provider value={{ managerId, setManagerId }}>
        <>
          {page !== "registration" && <ManagerHeader></ManagerHeader>}
          <main>
            <Outlet />
          </main>
        </>
      </ManagerIdContext.Provider>
    </PageContext.Provider>
  );
}

export default ManagerView;
