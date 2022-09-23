import React from "react";

const SignUp = React.lazy(() => import("../services/authen/pages/Signup.js"));
const Login = React.lazy(() => import("../services/authen/pages/Login.js"));

const Search = React.lazy(() => import("../services//search/Search.js"));
const Home = React.lazy(() => import("../services//shared/pages/Home.js"));
const Test = React.lazy(() => import("../services//search/Test.js"));
const SpeechToText = React.lazy(() =>
  import("../services//search/SpeechToText.js")
);

// Những route chỉ truy xuất khi chưa đăng nhập
const publicRoute = [
  { path: "/sign-up", name: "SignUp", element: <SignUp /> },
  { path: "/login", name: "Login", element: <Login /> },
];

// Những route dùng khi đã đăng nhập
const protectedRoute = [];

// route dùng cho mọi trường hợp
const commonRoute = [
  { path: "/search", name: "Search", element: <Search /> },
  { path: "/test", name: "Test", element: <Test /> },
  { path: "/speech-2-text", name: "SpeechToText", element: <SpeechToText /> },
  { path: "/", name: "Home", element: <Home /> },
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
