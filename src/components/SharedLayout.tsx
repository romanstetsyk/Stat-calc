import { Flex } from "@chakra-ui/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "src/components/NavBar";

export const SharedLayout = () => {
  return (
    <Flex direction={"column"} height={"100vh"} overflow={"scroll"}>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </Flex>
  );
};
