import { useFormatter } from "next-intl"

export function useFormatDate(input: string): string {
  const format = useFormatter()
  const date = new Date(input)

  return format.dateTime(date, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(input: string) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
}
