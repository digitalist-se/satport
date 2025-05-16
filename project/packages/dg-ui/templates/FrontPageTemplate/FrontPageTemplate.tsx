import styled from "styled-components";
import get from "lodash/get";
import { media } from "@dg/utils";
import { NodeTeaser } from "../../organisms/NodeTeaser";

const StyledArticleListing = styled.div`
  border-radius: 13px;
  background: #fff;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const StyledBasicPageListing = styled.div`
  margin-bottom: 2rem;
  ${media("tablet")} {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.5rem;
  }

  > div {
    ${media("tablet")} {
      width: 33%;
      min-width: 33%;
    }
  }
`;

export const FrontPageTemplate = ({ latest_articles, basic_pages }) => {
  return (
    <>
      <h1 className="visually-hidden">Home</h1>
      <div>
        <h2>Latest articles</h2>
        <StyledArticleListing>
          {latest_articles?.length ? (
            latest_articles.map((node, i) => {
              return (
                <NodeTeaser
                  key={`ArticleTeaser-${i}`}
                  path={node.path.alias}
                  title={node.title}
                  image_url={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${get(
                    node,
                    "field_teaser_image.uri.url"
                  )}`}
                  image_alt={get(
                    node,
                    "field_teaser_image.resourceIdObjMeta.alt"
                  )}
                />
              );
            })
          ) : (
            <span>No nodes found</span>
          )}
        </StyledArticleListing>
      </div>
      <div>
        <h2>Basic pages</h2>
        <StyledBasicPageListing>
          {basic_pages?.length ? (
            basic_pages.map((node, i) => {
              return (
                <NodeTeaser
                  key={`BasicPageTeaser-${i}`}
                  path={node.path.alias}
                  title={node.title}
                  image_url={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${get(
                    node,
                    "field_teaser_image.uri.url"
                  )}`}
                  image_alt={get(
                    node,
                    "field_teaser_image.resourceIdObjMeta.alt"
                  )}
                />
              );
            })
          ) : (
            <StyledArticleListing>
              <span>No nodes found</span>
            </StyledArticleListing>
          )}
        </StyledBasicPageListing>
      </div>
    </>
  );
};
