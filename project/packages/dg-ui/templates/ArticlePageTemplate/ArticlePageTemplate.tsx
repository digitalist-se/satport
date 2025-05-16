import styled from "styled-components";
import get from "lodash/get";
import { FieldParagraphs } from "../../organisms/paragraphs/FieldParagraphs";
import { formatDate } from "@dg/utils/lib";

const StyledPageWrapper = styled.div`
  background: #fff;
  max-width: 1000px;
`;

const StyledContentWrapper = styled.div`
  padding: 20px 0;
  max-width: 800px;
`;

const StyledTitle = styled.h1`
  margin-bottom: 0.5rem;
`;

const StyledAuthorAndDateWrapper = styled.div`
  color: #999;
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
`;

export const ArticlePageTemplate = ({ node }) => {
  const image_url = get(node, "field_teaser_image.uri.url");
  const image_alt = get(node, "field_teaser_image.resourceIdObjMeta.alt");

  return (
    <StyledPageWrapper>
      {image_url && (
        <img
          src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${image_url}`}
          alt={image_alt}
          width="1000"
          height="500"
        />
      )}

      <StyledContentWrapper>
        {/* Title */}
        <StyledTitle>{node.title}</StyledTitle>
        <StyledAuthorAndDateWrapper>
          {node.uid?.display_name ? (
            <span>
              Posted by <span>{node.uid?.display_name}</span>
            </span>
          ) : null}
          <span> - {formatDate(node.created)}</span>
        </StyledAuthorAndDateWrapper>
        {/* Teaser text */}
        {/* {node.field_teaser && (
        <div
          dangerouslySetInnerHTML={{ __html: node.field_teaser.processed }}
        ></div>
      )} */}
        {/* Paragraphs */}
        <FieldParagraphs paragraphs={node.field_paragraphs} />
      </StyledContentWrapper>
    </StyledPageWrapper>
  );
};
