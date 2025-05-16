import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import { drupal } from "@/lib/drupal"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import type { DrupalNode } from "next-drupal"

export default async function Home({
  params: { lng },
}: {
  params: { lng: string }
}) {
  // Enable static rendering
  setRequestLocale(lng)
  const t = await getTranslations("Default")

  const articleNodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      locale: lng,
      defaultLocale: routing.defaultLocale,
      params: {
        "filter[status]": 1,
        "fields[node--article]": "title,path,field_teaser_image,uid,created",
        include: "field_teaser_image,uid",
        sort: "-created",
      },
      next: {
        revalidate: 3600,
      },
    }
  )

  return (
    <>
      <h1 className="mb-10 text-6xl font-black">
        {t("LatestArticlesHeading")}
      </h1>
      {articleNodes?.length ? (
        articleNodes.map((node) => (
          <div key={node.id}>
            <ArticleTeaser node={node} />
            <hr className="my-20" />
          </div>
        ))
      ) : (
        <p className="py-4">{t("NoArticlesFound")}</p>
      )}
    </>
  )
}
