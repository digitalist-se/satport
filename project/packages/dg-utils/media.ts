import { breakpoints } from "./breakpoints";

// Media function - breakpoint helper
export const media = (minWidthBreakpoint: any, maxWidthBreakpoint?: any) => {
  // Get corresponding sizes
  // Minimum width
  const minWidth =
    minWidthBreakpoint && breakpoints[minWidthBreakpoint]
      ? breakpoints[minWidthBreakpoint] + `px`
      : Number.isInteger(minWidthBreakpoint) && minWidthBreakpoint > 0
      ? minWidthBreakpoint + `px`
      : 0;

  // Maximum width
  const maxWidth =
    maxWidthBreakpoint && breakpoints[maxWidthBreakpoint]
      ? breakpoints[maxWidthBreakpoint] - 1 + `px`
      : Number.isInteger(maxWidthBreakpoint) && maxWidthBreakpoint > 0
      ? maxWidthBreakpoint - 1 + `px`
      : 0;

  if (maxWidth) {
    return `@media (min-width: ${minWidth}) and (max-width: ${maxWidth})`;
  } else {
    return `@media (min-width: ${minWidth})`;
  }
};
