import { DraftAlert } from "@/components/misc/DraftAlert"
import { HeaderNav } from "@/components/navigation/HeaderNav"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import type { ReactNode } from "react"

import "@/styles/globals.css"

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "Default" })

  return {
    title: {
      default: t("SiteName"),
      template: `%s | ${t("SiteName")}`,
    },
    description: t("SiteDescription"),
    icons: {
      icon: "/favicon.ico",
    },
  }
}

export default async function LocaleLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params: { lng },
}: {
  children: ReactNode
  params: { lng: string }
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(lng as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={lng}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <DraftAlert />
          <div className="max-w-screen-md px-6 mx-auto">
            <HeaderNav />
            <main className="container py-10 mx-auto">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
