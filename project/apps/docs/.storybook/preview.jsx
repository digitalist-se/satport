import React from "react";
import theme from "./theme";
import { GlobalStyles } from "@dg/ui";

export const decorators = [
  (Story) => (
    <>
      <GlobalStyles />
      <Story />
    </>
  ),
];

export const parameters = {
  viewMode: "docs",
  docs: {
    theme,
  },
};
export const tags = ["autodocs"];
