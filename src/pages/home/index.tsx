import React, { memo } from "react";
import { useMobileToggle } from "@/hooks/useMobileToggle";
import PC from "./PC";
import Mobile from "./Mobile";

function IndexPage() {
  const isMobile = useMobileToggle();
  console.log(isMobile, "===22");
  return isMobile ? <Mobile /> : <PC />;
}

export default memo(IndexPage);
