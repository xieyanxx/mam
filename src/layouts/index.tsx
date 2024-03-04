import Footer from "@/components/Footer";
import Header from "@/components/Web/Header";
import Nav from "@/components/Mobile/Header";
import { useMobileToggle } from "@/hooks/useMobileToggle";
import { Outlet } from "umi";

export default () => {
  const isMobile = useMobileToggle();
  return (
    <>
      {isMobile ? <Nav /> : <Header />}

      <Outlet />
      <Footer />
    </>
  );
};
