import axios from "axios";
import React, { useEffect } from "react";
import API from "../../../config/API";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(API.API_ROUTE + "/user/refresh", {
        withCredentials: true,
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log("err", err);
        navigate("/login");
      });
  });
  return <div>Home</div>;
}
