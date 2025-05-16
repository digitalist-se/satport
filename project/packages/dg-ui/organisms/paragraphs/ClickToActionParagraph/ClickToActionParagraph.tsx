import get from "lodash/get";

export const ClickToActionParagraph = ({ paragraph }) => {
  const link_uri = get(paragraph, "field_link.uri");
  let link_title = get(paragraph, "field_link.title");
  const button_size = get(paragraph, "field_button_size");

  if (!link_title) {
    link_title = link_uri;
  }

  return (
    <div className={"button-size-" + button_size}>
      <a href={link_uri}>{link_title}</a>
    </div>
  );
};
