import { forwardRef } from "react"
import { ComponentProps } from "react"
import { Link as I18nLink } from "@/i18n/routing"

type LinkProps = ComponentProps<typeof I18nLink>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkWithRef(
    {
      // Turn next/link prefetching off by default.
      // @see https://github.com/vercel/next.js/discussions/24009
      prefetch = false,
      ...rest
    },
    ref
  ) {
    return <I18nLink prefetch={prefetch} {...rest} ref={ref} />
  }
)
