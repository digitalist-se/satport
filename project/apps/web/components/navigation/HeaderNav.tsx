import { Link } from "@/components/navigation/Link"
import { useTranslations } from "next-intl"

export function HeaderNav() {
  const t = useTranslations("Default")

  return (
    <header>
      <div className="container flex items-center justify-between py-6 mx-auto">
        <Link href="/" className="text-2xl font-semibold no-underline">
          {t("SiteName")}
        </Link>
        <Link
          href="https://next-drupal.org/docs"
          target="_blank"
          rel="external"
          className="hover:text-blue-600"
        >
          {t("ReadTheDocs")}
        </Link>
      </div>
    </header>
  )
}
