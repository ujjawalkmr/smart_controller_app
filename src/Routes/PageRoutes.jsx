// src/routes/PageRoutes.jsx

import { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import routesConfig from "../config/routeConfig";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../component/Navbar";

const PageRoutes = () => {

  return (
    <BrowserRouter>
<Navbar />
      <Suspense fallback={<div>Loading...</div>}>

        <Routes>

          {routesConfig.map((route) => {

            const Page = route.element;

            if (route.protected) {
console.log("Protected route:", route.path);
              return (
                <Route
                  key={route.path}
                  element={<ProtectedRoute />}
                >
                  <Route
                    path={route.path}
                    element={<Page />}
                  />
                </Route>
              );
            }
console.log("Public route:", route.path);
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<Page />}
              />
            );

          })}

        </Routes>

      </Suspense>

    </BrowserRouter>
  );
};

export default PageRoutes;