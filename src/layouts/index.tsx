import EthersContainer from "@/components/EthersContainer";
import Nav from "@/components/Mobile/Header";
import Header from "@/components/Web/Header";
import { useMobileToggle } from "@/hooks/useMobileToggle";
import { Outlet } from "umi";

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
      <EthersContainer>
        <Outlet />
      </EthersContainer>
    </>
  );
};
