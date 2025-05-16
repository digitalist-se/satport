import styled from "styled-components";
import Link from "next/link";
import get from "lodash/get";
import { media } from "@dg/utils";
import { useRouter } from "next/router";
import { HeaderUser } from "./HeaderUser";

const StyledHeader = styled.header`
  background: #fff;
  border-bottom: 1px solid #ddd;
`;

const StyledHeaderInner = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 1100px;
  padding: 10px 20px;
  justify-content: left;
`;

const StyledLogoWrapper = styled.div`
  a {
    color: #000;
    display: flex;
    align-items: center;
    &:hover {
      color: #000;
    }
  }

  span {
    margin-left: 10px;
  }
`;

const StyledMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  ${media("tablet")} {
    margin-left: 80px;
  }

  li {
    margin-right: 1.5rem;
    ${media("tablet")} {
      margin-right: 2rem;
    }
  }

  li a {
    &.active {
      text-decoration: underline;
    }
  }
`;

const StyledAccountWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: right;
`;

const StyledHeaderUser = styled.div`
  display: flex;
  align-items: center;
`;

export const Header = ({ main_menu }) => {
  const router = useRouter();

  const main_menu_items = main_menu?.items || null;

  return (
    <StyledHeader>
      <StyledHeaderInner>
        <StyledLogoWrapper>
          <Link href="/">
            <>
              <img src="/logo.png" width="40" height="40" />
              <span>{process.env.DRUPAL_SITE_ID}</span>
            </>
          </Link>
        </StyledLogoWrapper>
        {main_menu_items && (
          <StyledMenu>
            {main_menu_items.map((item, i) => (
              <li key={`main_menu_item-${i}`}>
                <Link
                  href={item.url}
                  className={`${router.asPath == item.url ? "active" : ""}`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </StyledMenu>
        )}
        <StyledAccountWrapper>
          <HeaderUser />
        </StyledAccountWrapper>
      </StyledHeaderInner>
    </StyledHeader>
  );
};
