import React from "react";
import { NavLink } from "react-router-dom";

const navItem = "border-[1px] p-[0.4em] inline-block mr-[1em] hover:opacity";

export default function Header() {
  const makeClass = (isActive) => {
    return isActive
      ? `${navItem} bg-[#ffff92] text-[black]`
      : `${navItem} text-[black]`;
  };
  return (
    <div className="p-[0.2rem] border-[1px] flex justify-between">
      <div className="left-nav">
        <NavLink className={({ isActive }) => makeClass(isActive)} to="/">
          Home
        </NavLink>
        <NavLink className={({ isActive }) => makeClass(isActive)} to="/search">
          Search
        </NavLink>
        <NavLink className={({ isActive }) => makeClass(isActive)} to="/test">
          Test
        </NavLink>
        <NavLink
          className={({ isActive }) => makeClass(isActive)}
          to="/speech-2-text"
        >
          Speech to text
        </NavLink>
      </div>
      <div className="right-nav">
        <NavLink className={({ isActive }) => makeClass(isActive)} to="/login">
          Login
        </NavLink>
        <NavLink
          className={({ isActive }) => makeClass(isActive)}
          to="/sign-up"
        >
          Sign up
        </NavLink>
      </div>
    </div>
  );
}
