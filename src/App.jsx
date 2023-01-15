import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Menu } from "antd";
import "./App.css";

const MENUS = [
  {
    label: "canvas基础知识",
    key: "canvas_base",
    children: [
      {
        label: <NavLink to="/base/shape">canvas图形绘制基础</NavLink>,
        key: "/base/shape",
      },
      {
        label: <NavLink to="/base/style">canvas样式和颜色</NavLink>,
        key: "/base/style",
      },
    ],
  },
];
function App() {
  const location = useLocation()
  return (
    <div className="App">
      <div className="left">
        <Menu
          style={{ height: "100%", overflow: "auto" }}
          defaultOpenKeys={["canvas_base"]}
          selectedKeys={[location.pathname]}
          mode="inline"
          items={MENUS}
        />
      </div>
      <div className="right">
        <Outlet />
      </div>
    </div>
  );
}


export default App;
