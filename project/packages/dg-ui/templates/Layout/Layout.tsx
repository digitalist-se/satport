import styled from "styled-components";
import Link from "next/link";
import get from "lodash/get";
import { media } from "@dg/utils";
import { useRouter } from "next/router";
import { Header } from "./Header";

const StyledMainInner = styled.div`
  margin: 0 auto;
  max-width: 1100px;
  padding: 30px 20px;
`;

export const Layout = ({ children, pageProps }) => {
  const router = useRouter();

  const { main_menu } = pageProps;

  return (
    <>
      <Header main_menu={main_menu} />
      <main>
        <StyledMainInner>{children}</StyledMainInner>
      </main>
      <footer></footer>
    </>
  );
};
