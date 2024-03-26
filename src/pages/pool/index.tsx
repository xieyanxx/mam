import { useMobileToggle } from "@/hooks/useMobileToggle";
import { memo } from "react";
import Mobile from "./Mobile";
import PC from "./PC";

function IndexPage() {
  const isMobile = useMobileToggle();
  return isMobile ? <Mobile /> : <PC />;
}

export default memo(IndexPage);
