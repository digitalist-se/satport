import { useSession } from "next-auth/react";
import styled from "styled-components";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const StyledHeaderUser = styled.div`
  display: flex;
  align-items: center;
`;

export const HeaderUser = () => {
  const { data, status } = useSession();
  const { t } = useTranslation();

  return (
    <StyledHeaderUser>
      {status == "authenticated" ? (
        <div>
          <Link href="/user">{data?.user?.username}</Link>
        </div>
      ) : (
        <div>
          <Link href="/user">{t("Sign in")}</Link>
        </div>
      )}
    </StyledHeaderUser>
  );
};
