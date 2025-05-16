import styled from "styled-components";
import parse from "html-react-parser";
import Image from "next/image";

const StyledTitleWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const TitleAndTextParagraph = ({ paragraph }) => {
  return (
    <div>
      <StyledTitleWrapper>{paragraph.field_title}</StyledTitleWrapper>
      <div>
        {parse(paragraph.field_text.processed, {
          replace: (domNode: any) => {
            if (domNode.name == "img" && domNode.attribs.src) {
              const { src, alt, width, height } = domNode.attribs;
              return (
                <img
                  src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${src}`}
                  width={`${width}px`}
                  height={`${height}px`}
                  alt={alt}
                />
              );
            }
          },
        })}
      </div>
    </div>
  );
};
