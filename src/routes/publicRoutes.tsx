import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/public/Login";
import Register from "@/pages/public/Register";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/login" replace />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ],
};
