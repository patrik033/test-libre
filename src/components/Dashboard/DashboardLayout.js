"use client";

import { Layout, Menu } from "antd";
import { useState } from "react";
import {
  HomeOutlined,
  BarChartOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
  MenuUnfoldOutlined,
  ArrowRightOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import Dashboard from "@/app/Dashboard/Dashboard"; // Förladdad huvudkomponent

const { Sider, Content, Header } = Layout;

// Dynamisk komponentinläsning
const components = {
  Statistik: () => import("./Statistics"),
  Inställningar: () => import("./Settings"),
};

export default function DashboardLayout() {
  const [activeKey, setActiveKey] = useState("Home"); // Startar med "Home"
  const [Component, setComponent] = useState(() => Dashboard); // Dashboard är förladdad
  const [collapsed, setCollapsed] = useState(false); // Kollapsläge för sidomenyn

  // Hantera menyval
  const handleMenuClick = async ({ key }) => {
    if (key !== activeKey) {
      if (key === "Home") {
        setComponent(() => Dashboard);
      } else if (components[key]) {
        const { default: LoadedComponent } = await components[key]();
        setComponent(() => LoadedComponent);
      }
      setActiveKey(key);
    }
  };

  // Menydata
  const menuItems = [
    {
      key: "Home",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "Statistik",
      icon: <BarChartOutlined />,
      label: "Statistik",
    },
    {
      key: "Inställningar",
      icon: <SettingOutlined />,
      label: "Inställningar",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidomeny */}
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        width={200}
        trigger={null} // Tar bort standardkollapsknappen
      >
        <div
          className="logo"
          style={{
            color: "white",
            padding: "16px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: collapsed ? "12px" : "18px",
            transition: "font-size 0.3s",
          }}
        >
          LOGO
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={handleMenuClick}
          items={menuItems}
        />
        {/* Kollapsa/expandera-knapp längst ned */}
        {/* Kollapsa/expandera-knapp längst ned */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            width: "90%", // Ger en knapp som är lite mindre än hela bredden
            textAlign: "center",
            background: "#1890ff", // Ant Design blå färg
            color: "white",
            borderRadius: "4px",
            padding: "10px 0",
            cursor: "pointer",
            marginLeft: "5%",
          }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <>
              <ArrowRightOutlined style={{ marginRight: "8px" }} />
              Expand
            </>
          ) : (
            <>
              <ArrowLeftOutlined style={{ marginRight: "8px" }} />
              Collapse
            </>
          )}
        </div>

      </Sider>

      {/* Huvudinnehåll */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {menuItems.find((item) => item.key === activeKey)?.label || "Dashboard"}
          </h2>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div style={{ padding: "24px", background: "#fff", minHeight: "360px" }}>
            <Component /> {/* Dynamiskt innehåll */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
