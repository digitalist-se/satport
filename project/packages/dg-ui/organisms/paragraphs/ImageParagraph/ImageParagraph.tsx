import get from "lodash/get";

export const ImageParagraph = ({ paragraph }) => {
  const image_url = get(paragraph, "field_image.uri.url");
  const image_alt = get(paragraph, "field_image.resourceIdObjMeta.alt");

  return image_url ? (
    <div>
      <img
        src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${image_url}`}
        alt={image_alt}
      />
    </div>
  ) : null;
};
