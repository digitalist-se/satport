import Image from "next/image"
import { absoluteUrl, useFormatDate } from "@/lib/utils"
import { useTranslations } from "next-intl"
import type { DrupalNode } from "next-drupal"

interface ArticleProps {
  node: DrupalNode
}

export function Article({ node, ...props }: ArticleProps) {
  const t = useTranslations("Default")

  return (
    <article {...props}>
      <h1 className="mb-4 text-6xl font-black leading-tight">{node.title}</h1>
      <div className="mb-4 text-gray-600">
        {node.uid?.display_name ? (
          <span>
            {t("PostedBy")}{" "}
            <span className="font-semibold">{node.uid?.display_name}</span>
          </span>
        ) : null}
        <span> - {useFormatDate(node.created)}</span>
      </div>
      {node.field_teaser_image && (
        <figure>
          <Image
            src={absoluteUrl(node.field_teaser_image.uri.url)}
            width={768}
            height={400}
            alt={node.field_teaser_image.resourceIdObjMeta.alt || ""}
            priority
          />
          {node.field_teaser_image.resourceIdObjMeta.title && (
            <figcaption className="py-2 text-sm text-center text-gray-600">
              {node.field_teaser_image.resourceIdObjMeta.title}
            </figcaption>
          )}
        </figure>
      )}
      {node.field_teaser?.processed && (
        <div
          dangerouslySetInnerHTML={{ __html: node.field_teaser?.processed }}
          className="mt-6 font-serif text-xl leading-loose prose"
        />
      )}
    </article>
  )
}
