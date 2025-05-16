import styled, { createGlobalStyle, css } from "styled-components";
import { media } from "@dg/utils";

export const GlobalStyles = createGlobalStyle`
  :root {
    // Custom properties
    --font-default: 'Roboto', sans-serif;
    --font-beta: 'Roboto Slab', serif;;
    --color-orange: #FE4A00;
    --color-grayblue: #849FB3;
    --color-graybg: #F3F6F8;
    --color-border: rgba(49,47,44,0.2);
  }
  
  /*
   * Base
   */
  * {
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
  }

  body {
    background: ${({ isFrontPage }) => (isFrontPage ? "#f4f4f4" : "#FFF")};
    color: #000;
    font-family: var(--font-default);
    font-weight: 400;
    font-style: normal;
    margin: 0;
    font-size: 1rem;
    line-height: 1.3;
    width: 100%;
  }

  a {
    color: var(--color-orange);
    text-decoration: none;
    transition: color 0.1s;

    &:hover {
      color: var(--color-orange);
    }
  }

  p {
    line-height: 1.5;
    margin: 0 0 1em 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #000;
    font-family: var(--font-beta);
    font-weight: 400;
    line-height: 1.2;
    margin: 0 0 0.66em 0;
  }

  h1 {
    font-size: 2.5rem;
    ${media("desktop")} {
      font-size: 2.7rem;
    }
  }

  h2 {
    font-size: 2.1rem;
  }

  h3 {
    font-size: 1.8rem;
  }

  h4 {
  }

  h5 {
  }

  h6 {
  }

  ul,
  ol {
    padding: 0 0 0 1.7rem;
  }

  /*
   *  Media
   */
  img,
  figure {
    max-width: 100%;    
    height: auto;
  }

  svg, iframe {
    max-width: 100%;
  }

  img, svg {
    vertical-align: top;
  }

  /*
   *  Forms
   */
  select,
  input {
    font-size: 1rem;
    font-weight: 400;
  }

  input[type="text"],
  input[type="password"] {
    border: 1px solid #666;
    height: 40px;
    padding: 0 0.4rem;
    max-width: 400px;
    width: 100%;
  }

  button,
  input[type="button"],
  .button-link {
    background: #000;
    display: inline-block;
    border: 1px solid #000;
    color: #FFF;
    cursor: pointer;
    font-size: 1rem;
    font-family: var(--font-default);
    font-weight: 400;
    line-height: 1.3;
    padding: 0.6rem 1.3rem;
    margin: 0 0.5rem 0.5rem 0;
    transition: all 0.1s;

    &:hover {
      background: #FFF;
      border-color: var(--color-orange);
      color: var(--color-orange);
    }
  }

  .select-dropdown {
    display: inline-block;
    position: relative;
    margin: 0 0.5rem 0.5rem 0;

    &:after {
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #000;
      content: " ";
      height: 0;
      margin-top: -3px;
      pointer-events: none;
      right: 8px;
      top: 50%;
      position: absolute;
      width: 0;
   }

    > select {
      margin: 0;
    }
  }

  select {
    border: 1px solid rgb(217, 219, 217);
    padding: 0.5rem 2rem 0.5rem 1rem;
    appearance: none;
    background: none;
    border-radius: 0;
    font-family: var(--font-family-sans);
    font-size: 1rem;
    padding: 0.5rem 2rem 0.5rem 0;
    margin: 0 0.5rem 0.5rem 0;
    width: 100%;
  }

  .checkbox-wrapper {
    position: relative;

    input[type="checkbox"] {
      position: absolute;
      top: 4px;
      left: 0;
    }

    label {
      display: inline-block;
      line-height: 1.5;
      padding-left: 1.5rem;
    }
  }

  input[type="checkbox"] {
    display: inline-block;
    margin-right: 0.5rem;
  }

  // Form item
  .formItem {
    margin-bottom: 0.5rem;

    > label {
      display: block;
    }

    > input[type="text"] {

    }
  }

  table {
    border-right: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 1rem;
    width: 100%;

    td, th {
      border-left: 1px solid var(--color-border);
      border-top: 1px solid var(--color-border);
      padding: 0.3rem;
    }

    p {
      margin: 0;
    }
  }
  
  @keyframes fade {
    0% { opacity: 0 } 
    50% { opacity: 1 }
    100% { opacity: 0 }
  }

  @keyframes spin {
    from {
      transform:rotate(0deg);
    }
    to {
      transform:rotate(360deg);
    }
  }
  
  .visually-hidden {
    clip: rect(1px,1px,1px,1px);
    word-wrap: normal;
    height: 1px;
    overflow: hidden;
    position: absolute!important;
    width: 1px;
  }
 
`;
