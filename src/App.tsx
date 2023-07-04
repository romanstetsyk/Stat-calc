import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { SharedLayout } from "~/components/SharedLayout";

const Application = lazy(() => import("~/pages/Application"));
const Home = lazy(() => import("~/pages/Home"));

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<Home />} />
        <Route path="/app" element={<Application />} />
        <Route path="/about" element={<div>/about</div>} />
        <Route path="*" element={<div>not found</div>} />
      </Route>
    </Routes>
  );
};
