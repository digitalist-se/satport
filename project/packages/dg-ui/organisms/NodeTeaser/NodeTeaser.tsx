import React from "react";
import styled from "styled-components";
import { media } from "@dg/utils";
import Link from "next/link";

const StyledNodeTeaser = styled.article`
  background: #fff;

  ${media("tablet")} {
    display: flex;
  }
`;

const StyledImageWrapper = styled.div`
  ${media("tablet")} {
    margin-right: 15px;
    min-width: 200px;
  }

  img {
    width: 100%;
    ${media("tablet")} {
      max-width: 200px;
    }
  }
`;

const StyledInfoArea = styled.div`
  padding-top: 6px;

  .read-more {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

const StyledTitle = styled.h3`
  font-size: 1.4rem;
  margin: 0 0 0.2rem 0;
`;

type NodeTeaserProps = {
  path: string;
  title: string;
  image_url?: string | null;
  image_alt?: string | null;
};

export const NodeTeaser = ({
  path,
  title,
  image_url,
  image_alt,
}: NodeTeaserProps) => {
  return (
    <StyledNodeTeaser>
      {image_url && (
        <StyledImageWrapper>
          <Link href={path}>
            <img
              src={`${image_url}`}
              alt={image_alt}
              width="200"
              height="150"
            />
          </Link>
        </StyledImageWrapper>
      )}

      <StyledInfoArea>
        <Link href={path}>
          <StyledTitle>{title}</StyledTitle>
        </Link>
      </StyledInfoArea>
    </StyledNodeTeaser>
  );
};
