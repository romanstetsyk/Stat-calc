import { Suspense, lazy } from "react";
import { Flex } from "@chakra-ui/react";

// import { SplitPanes } from "~/layout/SplitPanes";

const StatMenu = lazy(() => import("~/layout/StatMenu"));
const SplitPanes = lazy(() => import("~/layout/SplitPanes"));

// Should be default export to use with dynamic import
export default function Application() {
  return (
    <Flex direction={"column"} height={"100vh"}>
      <Suspense fallback={<div>Loading...</div>}>
        <StatMenu />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <SplitPanes />
      </Suspense>
    </Flex>
  );
}
