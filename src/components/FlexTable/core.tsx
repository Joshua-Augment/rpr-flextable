import { StyleSheet, Text, Image } from "@react-pdf/renderer";
// import { ContentBlock } from "draft-js";
import { Style } from "@react-pdf/types";
import React from "react";
// import { logger } from "../../../../../../../../../components/js";
import StringParser from "./StringParser";
export type allowedTypes =
  | string
  | number
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactPortal;
export type itemRenderTypes = "text" | "sheet" | "html";
export type itemType =
  | allowedTypes
  | {
      type?: itemRenderTypes;
      textStyles?: Style;
      text: allowedTypes;
      img?: string;
      styles?: Style;
      childRows?: itemType[][];
    };
export type stringparsertypes = "p" | "ol" | "li" | "ul" | "div";

export const bracketFinder =
  /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>|<([A-Z][A-Z0-9]*).*?\/>/gi;
export const nodeFinder = /<([A-Z][A-Z0-9]*)\b[^>]*>/gi;
export const classFinder = /class="([^"]+)"/g;

export const htmlStyles: { [a: string]: Style } = StyleSheet.create({
  p: { display: "flex", width: "100%", fontWeight: "bold", margin: "5px 0px" },
  div: { display: "flex", width: "100%" },
  ol: { display: "flex", width: "100%", paddingLeft: "15px" },
  ul: { display: "flex", width: "100%", paddingLeft: "15px" },
});

// export const parseContentBlock = (a: ContentBlock) => {
//   a.getData();
// };

export const fullWidth = 595;

export const parseInput = (
  item: itemType,
  fedStyles = {},
  type: "text" | "sheet" | 'html' = "text"
) => {
  return type === "text" ? (
    isAllowedGroup(item) ? (
      <Text style={{ ...fedStyles }}>{item}</Text>
    ) : item.img ? (
      <Image src={item.img} style={{ ...fedStyles, ...item.styles }} />
    ) : (
      <Text style={{ ...fedStyles, ...item.textStyles }}>
        {item.text as React.ReactNode}
      </Text>
    )
  ) : type === 'sheet' ? (
    <Text
      style={{ textAlign: "left", width: 200, color: "#2e19e6", ...fedStyles }}
      render={({ subPageNumber, subPageTotalPages }) =>
        `Sheet ${subPageNumber} of ${subPageTotalPages}`
      }
    />
  ) : type === 'html' ? (
    isAllowedGroup(item) ? item : <StringParser>{String(item.text)}</StringParser>
  ) : ''
};

export const isAllowedGroup = (item: itemType): item is allowedTypes => {
  if (
    typeof item === "string" ||
    typeof item === "number" ||
    typeof item === "boolean" ||
    React.isValidElement(item)
  ) {
    return true;
  } else {
    return false;
  }
};

export const borderType = (item: itemType) => {
  let borderArr = ["", "", "", ""];
  if (isAllowedGroup(item)) {
    return borderArr;
  } else {
    // Has all borders
    const allBorder = getProp(item, "border");
    const topBorder = getProp(item, "borderTop");
    const bottomBorder = getProp(item, "borderBottom");
    const leftBorder = getProp(item, "borderLeft");
    const rightBorder = getProp(item, "borderRight");

    if (allBorder !== "") {
      borderArr[0] = allBorder;
      borderArr[1] = allBorder;
      borderArr[2] = allBorder;
      borderArr[3] = allBorder;
    }
    if (leftBorder !== "") {
      borderArr[0] = leftBorder;
    }
    if (topBorder !== "") {
      borderArr[1] = topBorder;
    }
    if (rightBorder !== "") {
      borderArr[2] = rightBorder;
    }
    if (bottomBorder !== "") {
      borderArr[3] = bottomBorder;
    }

    return borderArr;
  }
};

export const removeFirstBracket = (item: string) => {
  return item.substring(item.indexOf(">") + 1);
};

export const removeLastBracket = (item: string) => {
  return item.substring(0, item.lastIndexOf("<"));
};

export const removeOuterBracket = (item: string) => {
  console.groupCollapsed(`Remove Outer Bracket - ${item}`);
  const _one = removeFirstBracket(item);
  console.log("Remove First Bracket", _one);
  const _two = removeLastBracket(item);
  console.log("Remove LAst Bracket", _two);
  console.groupEnd();
  return _two;
};
export const parseHtmlString = (str: string) => {
  console.groupCollapsed("parseHtmlString");
  const _string = str.match(bracketFinder);

  if (_string === null) {
    console.groupEnd();
    return "";
  }

  // const parsed = _string.map( element => {
  //   // Check for Classes
  //   const _classes = element.match(classFinder)
  //   // Get Content
  //   const matches = bracketFinder.exec(element)
  //   const _node = element.match(nodeFinder)
  //   const nodeType = _node !== null ? _node[0].substring(1,_node[0].length - 1) : ''
  //   const _child = removeOuterBracket(element)

  //   console.log("ELEMENT : ",element)
  //   console.log("Classes : ",_classes)
  //   console.log("matches : ", matches)
  //   console.log("Node : ", nodeType)
  // })

  console.groupEnd();
  return "";
};
export const parseHtmlComponents = (
  content: string,
  type: stringparsertypes
) => {
  // const _content:JSX.Element[] = []

  switch (type) {
    case "p":
      break;
    case "div":
      break;
  }
};

export const getItemActualXDim = (item: itemType) => {
  const borderX = getXaxis(item, "border");
  const paddingX = getXaxis(item, "padding");
  const width = getXaxis(item, "width");

  return borderX + paddingX + width;
};

const parseStyleToNumber = (item: string | number) => {
  console.log("[ParseStyleToNumber] - item", item);
  return Number(
    typeof item === "number"
      ? item
      : item.includes("px")
      ? item.replace(/px/g, "")
      : item
  );
};

export const getXaxis = (
  item: itemType,
  type: "border" | "padding" | "width"
) => {
  if (type === "width") {
    const width = getProp(item, "width");
    return width === "" ? 0 : parseStyleToNumber(width);
  } else {
    const shortHand = getProp(item, type);

    const shortHandLeft = getProp(item, `${type}Left`);
    const shortHandRight = getProp(item, `${type}Right`);

    const _shortHand = shortHand === "" ? 0 : parseStyleToNumber(shortHand);
    const _shortHandLeft =
      shortHandLeft === "" ? 0 : parseStyleToNumber(shortHandLeft);
    const _shortHandRight =
      shortHandRight === "" ? 0 : parseStyleToNumber(shortHandRight);

    return _shortHand + _shortHandRight + _shortHandLeft;
  }
};

export const getProp = (item: itemType, cssProp: string) => {
  console.groupCollapsed(
    `GetProp : ${isAllowedGroup(item) ? "No Style" : "Has Style"}`
  );
  console.log(
    "Found it ? ",
    !isAllowedGroup(item) ? item?.styles?.[cssProp as keyof Style] ?? "" : ""
  );
  console.groupEnd();
  if (isAllowedGroup(item)) {
    return "";
  } else {
    return item?.styles?.[cssProp as keyof object] ?? "";
  }
};

export const calculateFlexWidths = (
  rowItems: itemType[],
  maxWidth: number,
  cellMarginX: number,
  cellPaddingX: number,
  widthOverrides ?: number[]
) => {
  console.groupCollapsed("Calculate Flex Widths");
  console.log("Row Items : ", rowItems);
  console.log(
    `RowItem :${rowItems.length} | maxWidth:${maxWidth} | cellMarginX:${cellMarginX}| cellPaddingX:${cellPaddingX}`
  );
  // let currentWidth = maxWidth - (cellPaddingX * rowItems.length)

  let currentWidth = maxWidth;
  console.log(`Current Width : ${currentWidth}`);

  const totalFixWidth = rowItems
    .map((item, index) => getItemActualXDim(item))
    .reduce((a, b) => a + b, 0) + (widthOverrides ? widthOverrides.reduce((a, b) => a + b) : 0);
  console.log(`Total Fix Width : ${totalFixWidth}`);

  currentWidth -= totalFixWidth;
  console.log(
    `New Current Width : ${currentWidth}, to be shared with ${
      rowItems.filter((item) => getProp(item, "width") === "").length
    } elements`
  );
  const freeFlexWidth =
    currentWidth /
    rowItems.filter((item) => getProp(item, "width") === "").length;
  console.log(`Flex Width : ${freeFlexWidth}`);

  const widthTable = rowItems.map((item, index) => {
    const currentWidth = getProp(item, "width");
    console.log("Current Width : ", currentWidth);
    if (currentWidth === "") {
      if (widthOverrides !== undefined && widthOverrides[index] !== undefined) {
        if (widthOverrides[index] !== undefined) {return `${widthOverrides[index]}px`}
      } else {
        return `${freeFlexWidth}px`;
      }
    } else {
      return currentWidth;
    }
  });

  console.log("Final flex Table - ", widthTable);
  console.groupEnd();
  return widthTable;
};
