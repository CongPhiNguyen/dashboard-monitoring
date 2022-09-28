import React from "react";

const Login = React.lazy(() => import("../services/authen/pages/Login.js"));
const Home = React.lazy(() => import("../services//shared/pages/Home.js"));

// Những route chỉ truy xuất khi chưa đăng nhập
const publicRoute = [{ path: "/login", name: "Login", element: <Login /> }];

// Những route dùng khi đã đăng nhập
const protectedRoute = [
  { path: "/", name: "Home", element: <Home /> },
];

// route dùng cho mọi trường hợp
const commonRoute = [

];

// Route dùng cho manager
const managerRoute = [];

const routes = {
  publicRoute,
  commonRoute,
  protectedRoute,
  managerRoute,
};

export default routes;
