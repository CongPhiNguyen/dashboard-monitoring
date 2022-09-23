import { Typography, Button, Form, Input } from "antd";
import react from "react";
import axios from "axios";
import API from "../../../config/API.js";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const callAPISendSignUp = (value) => {
    axios
      .post(API.API_ROUTE + "/user/sign-up", { ...value })
      .then((data) => {
        console.log(data);
        navigate("/login");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const onFinish = (values) => {
    console.log(values);
    callAPISendSignUp(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="page-content-container">
      <Typography.Title level={4} className="text-center uppercase">
        Sign up
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

        <Form.Item
          label="Repeat Password"
          name="repeatPassword"
          rules={[
            { required: true, message: "Please input your repeat password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
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
