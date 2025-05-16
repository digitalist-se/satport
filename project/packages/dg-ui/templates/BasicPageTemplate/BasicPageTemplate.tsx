import styled from "styled-components";
import get from "lodash/get";
import { FieldParagraphs } from "../../organisms/paragraphs/FieldParagraphs";

const StyledPageWrapper = styled.div`
  background: #fff;
  max-width: 1000px;
`;

const StyledContentWrapper = styled.div`
  padding: 20px 0;
  max-width: 800px;
`;

const StyledTitle = styled.h1``;

export const BasicPageTemplate = ({ node }) => {
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
