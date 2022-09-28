import React, { useEffect, useRef, useState } from "react";
import { message, Button, Typography } from "antd";
import { post } from "../../../api/axios";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Input } from "antd";
import URL from "../../../api/config";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "../../../helper/Cookies";
import { setLoginState } from "../authenSlice";


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    if (username.length === 0 || password.length === 0) {
      message.error("Nhập đầy đủ thông tin");
    } else {
      post(URL.URL_ADMIN_LOGIN, { username, password })
        .then((res) => {
          if (res.data.message === "Đăng nhập thành công") {
            message.success(res.data.message);
            setAccessToken(res.data.token);
            dispatch(setLoginState(true));
            navigate("/");
          } else {
            message.error(res.data.message);
            dispatch(setLoginState(false));
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    }
  };
  return (
    <div className="body-animation-login overflow-hidden page-container">
      <img
        className="fixed top-[100px] left-[20px]"
        src="./login.png"
        alt="logo taptap"
      />
      <form className="form items-center text-center !py-[30px] !px-[60px] bg-[white] rounded-[8px] relative min-w-[500px] shadow-2xl ">
        <Typography.Title level={2}>LOGIN</Typography.Title>
        <Input
          size="large"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          placeholder="Username"
          prefix={<UserOutlined />}
          className={"mb-8"}
        />
        <Input
          size="large"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
          prefix={<LockOutlined />}
          className={"mb-8"}
          type={"password"}
        />
        <Button onClick={handleLogin} type="primary" className="w-[100%]">
          Login
        </Button>
      </form>
    </div>
  );
}
