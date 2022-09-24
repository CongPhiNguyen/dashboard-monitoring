import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import routes from "./router";
import { get } from "../api/axios";
import URL from "../api/config";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { setLoginState } from "../services/authen/authenSlice";

const Routers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.authenSlice.isLogin);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refreshApi = () => {
      get(URL.URL_ADMIN_REFRESH)
        .then((res) => {
          if (res.data.success) {
            dispatch(setLoginState(true));
            navigate("/");
            setIsLoading(false);
          } else {
            navigate("/login");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          navigate("/login");
          setIsLoading(false);
        });
    };
    refreshApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Spin></Spin>;

  return (
    <React.Suspense>
      <Routes>
        {userLogin
          ? routes.protectedRoute.map((route, index) => {
              return (
                route.element && (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                )
              );
            })
          : routes.publicRoute.map((route, index) => {
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
      </Routes>
    </React.Suspense>
  );
};

export default Routers;
