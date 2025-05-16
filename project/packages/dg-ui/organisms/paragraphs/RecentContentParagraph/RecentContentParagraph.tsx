import { DrupalClient } from "next-drupal";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { NodeTeaser } from "../../NodeTeaser";
import get from "lodash/get";

const StyledArticleListing = styled.div`
  border-radius: 13px;
  background: #fff;
  padding: 1rem;
  margin-bottom: 2rem;
`;

export const RecentContentParagraph = ({ paragraph }) => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const drupal = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL);

  useEffect(() => {
    setLoading(true);

    // Query items to include.
    const options = {
      "filter[status]": 1,
      "fields[node--article]":
        "title,path,field_teaser,field_teaser_image,uid,created",
      "fields[node--page]":
        "title,path,field_teaser,field_teaser_image,uid,created",
      include: "uid,field_teaser_image",
      sort: "-created",
      filter: {
        "field_site.meta.drupal_internal__target_id":
          process.env.DRUPAL_SITE_ID,
      },
      page: null,
    };

    // Apply tags filter when selected.
    if (paragraph.field_included_tags.length) {
      options.filter["field_tags.meta.drupal_internal__target_id"] =
        paragraph.field_included_tags[0].resourceIdObjMeta.drupal_internal__target_id;
    }

    // Apply pager when selected.
    if (paragraph.field_include_number_of_items) {
      options.page = {
        limit: paragraph.field_include_number_of_items,
      };
    }

    // Page / article endpoint.
    const content_type =
      paragraph.field_content_type.resourceIdObjMeta.drupal_internal__target_id;
    fetch(drupal.buildUrl(`/jsonapi/node/${content_type}`, options).toString())
      .then((res) => res.json())
      .then((data) => {
        setData(drupal.deserialize(data));
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <StyledArticleListing>
      {data?.length ? (
        data.map((node, i) => {
          return (
            <NodeTeaser
              key={`ArticleTeaser-${i}`}
              path={node.path.alias}
              title={node.title}
              image_url={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${get(
                node,
                "field_teaser_image.uri.url"
              )}`}
              image_alt={get(node, "field_teaser_image.resourceIdObjMeta.alt")}
            />
          );
        })
      ) : (
        <span>No nodes found</span>
      )}
    </StyledArticleListing>
  );
};
