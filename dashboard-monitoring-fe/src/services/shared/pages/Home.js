import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardFilled,
} from "@ant-design/icons";
import { AiOutlineFieldTime } from "react-icons/ai"
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import "./Home.css";
import Chart from "../components/Chart";
import Dashboard from "../components/Dashboard";
const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [key, setKey] = useState("1")
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        className="!bg-[white]"
        collapsed={collapsed}
      >
        <Menu
          theme="light"
          mode="inline"
          onClick={(e) => { setKey(e.key) }}
          defaultSelectedKeys={[key]}
          items={[
            {
              key: "1",
              icon: <DashboardFilled />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <AiOutlineFieldTime />,
              label: "Realtime",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {
            key === "1" ? <Dashboard /> : <Chart />
          }
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
