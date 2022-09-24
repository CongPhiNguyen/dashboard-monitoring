import { NavLink } from "react-router-dom";
import { Layout } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginState } from "../../authen/authenSlice";
import { setAccessToken } from "../../../helper/Cookies";
import { useNavigate } from "react-router-dom";
const { Header } = Layout;

const HeaderMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navItem =
    "px-3 inline-block mr-[1em] hover:opacity hover:text-[#f73965] font-[600] text-[16px] text-[white]";

  const makeClass = (isActive) => {
    return isActive ? `${navItem} bg-[#9e8725]` : `${navItem}`;
  };

  const userLogin = useSelector((state) => state.authenSlice.isLogin);

  const logOut = () => {
    setAccessToken("");
    dispatch(setLoginState(false));
    navigate("/login");
  };

  return (
    <Layout>
      <Header className="header items-center !bg-[#f7cc15] flex justify-between">
        <div className="left-nav flex">
          <img
            src="/logo_2.png"
            alt=""
            className="h-[50px] ml-[-40px] mr-[10px]"
          />
          <NavLink to="/service-management">
            <img
              className="h-[40px] mt-[10px] mr-[30px]"
              alt="logo"
              width={100}
              src="/logo.png"
            ></img>
          </NavLink>
          {/* {userLogin && (
            <React.Fragment>
              <NavLink
                className={({ isActive }) => makeClass(isActive)}
                to="/service-management"
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive }) => makeClass(isActive)}
                to="/add-service"
              >
                Add Service
              </NavLink>
            </React.Fragment>
          )} */}
        </div>
        <div className="right-nav flex">
          {userLogin && (
            <button
              className="text-[white] hover:text-[#f73965] mr-[-20px] font-[600] text-[16px]"
              onClick={() => logOut()}
            >
              Log out
            </button>
          )}
        </div>
      </Header>
    </Layout>
  );
};

export default HeaderMain;
