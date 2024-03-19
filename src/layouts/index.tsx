import Footer from "@/components/Footer";
import Header from "@/components/Web/Header";
import Nav from "@/components/Mobile/Header";
import { useMobileToggle } from "@/hooks/useMobileToggle";
import { Outlet } from "umi";
import EthersContainer from "@/components/EthersContainer";

export default () => {
  const isMobile = useMobileToggle();
  return (
    <>
      {isMobile ? (
        <EthersContainer>
          <Nav />
        </EthersContainer>
      ) : (
        <EthersContainer>
          <Header />
        </EthersContainer>
      )}

      <Outlet />
      <Footer />
    </>
  );
};
