import { TitleAndTextParagraph } from "../TitleAndTextParagraph";
import { ImageParagraph } from "../ImageParagraph";
import { ClickToActionParagraph } from "../ClickToActionParagraph";
import { RecentContentParagraph } from "../RecentContentParagraph";

export const FieldParagraphs = ({ paragraphs }) => {
  return paragraphs?.length > 0
    ? paragraphs.map((paragraph, i) => {
        switch (paragraph.type) {
          case "paragraph--title_and_text":
            return (
              <TitleAndTextParagraph
                key={`paragraph-${i}`}
                paragraph={paragraph}
              />
            );
          case "paragraph--image":
            return (
              <ImageParagraph key={`paragraph-${i}`} paragraph={paragraph} />
            );
          case "paragraph--click_to_action":
            return (
              <ClickToActionParagraph key={`paragraph-${i}`} paragraph={paragraph} />
            );
          case "paragraph--recent_content_list":
            return (
              <RecentContentParagraph key={`paragraph-${i}`} paragraph={paragraph} />
            );
          default:
            console.error(
              `field_paragraph: type ${paragraph.type} not rendered.`
            );
        }
      })
    : null;
};
