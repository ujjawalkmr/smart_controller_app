// src/routes/routesConfig.js

import { lazy } from "react";

const Dashboard = lazy(() => import("../Pages/Dashboard"));
const Settings = lazy(() => import("../Component/Setting"));
const LoginPage = lazy(() => import("../Pages/LoginPage"));


const routesConfig = [
  {
    path: "/",
    element: Dashboard,
    protected: false,
  },

  {
    path: "/login",
    element: LoginPage,
    protected: false,
  },

//   {
//     path: "/room-detail-view/:roomId",
//     element: RoomDetailView,
//     protected: true,
//   },

  {
    path: "/settings",
    element: Settings,
    protected: false,
  },
];

export default routesConfig;