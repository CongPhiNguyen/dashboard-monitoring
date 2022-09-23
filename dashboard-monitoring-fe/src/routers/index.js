import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import routes from "./router";
// import { useSelector } from "react-redux";

const Routers = () => {
  return (
    <React.Suspense>
      <Routes>
        {routes.publicRoute.map((route, index) => {
          return (
            route.element && (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            )
          );
        })}
        {routes.commonRoute.map((route, index) => {
          return (
            route.element && (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            )
          );
        })}
        {routes.protectedRoute.map((route, index) => {
          return (
            route.element && (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            )
          );
        })}
        {/* <Route path="*" element={<Navigate to={"/404-not-found"} />} /> */}
      </Routes>
    </React.Suspense>
  );
};

export default Routers;
