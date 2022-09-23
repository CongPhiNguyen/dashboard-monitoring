import React from "react";
import { Typography, Button, Form, Input, message } from "antd";
import axios from "axios";
import API from "../../../config/API.js";
import { useNavigate } from "react-router-dom";
import { cookiesUtil } from "../../../utilities/cookiesUtils";

export default function Login() {
  const navigate = useNavigate();

  const callAPISendSignIn = (value) => {
    axios
      .post(API.API_ROUTE + "/user/login", { ...value })
      .then((data) => {
        if (!data.data.success) throw Error("Login failed");
        message.success("Login success!!", 1);
        cookiesUtil.set("_jwt", data.data.token);
        navigate("/");
      })
      .catch((err) => {
        console.log("err", err);
        message.error("Login failed!!", 1);
      });
  };
  const onFinish = (values) => {
    console.log(values);
    callAPISendSignIn(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="page-content-container">
      <Typography.Title level={4} className="text-center uppercase">
        Login
      </Typography.Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 10 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
