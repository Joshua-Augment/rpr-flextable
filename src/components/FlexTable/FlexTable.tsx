import React from 'react'
import {View, StyleSheet} from '@react-pdf/renderer'
import { Style } from "@react-pdf/types";
import { borderType, calculateFlexWidths, isAllowedGroup, parseInput } from './core';
import produce from "immer"

export type allowedTypes = string | number
export type itemRenderTypes = "text" | "sheet" | "html";
export type itemType = allowedTypes| 
  {
    type?: itemRenderTypes;
    textStyles?: Style;
    text: allowedTypes;
    img?: string;
    styles?: Style;
    childRows?: itemType[][];
  };
export interface FlexTableProps {
  rows : itemType[][],
  headers : itemType[][],  
  fixed ?: boolean,
  fullWidth ?: number,
  outerBorder ?: string,
  innerBorder ?: string,
  containerStyle ?: Style,
  widths ?: number[]
}

const defaultOuterBorder = '2px solid red'
const defaultInnerBorder = '1px dotted black'
const contentContainerWidth = 800

const FlexTable = (props: FlexTableProps) => {
  console.groupCollapsed("FlexTable")
  const outerBorder = props.outerBorder ?? defaultOuterBorder;
  const innerBorder = props.innerBorder ?? defaultInnerBorder;
  const nullBorder = 'none'

  
  const styles = StyleSheet.create({
    containerStyle: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      margin: "0 0 15px 0",
      padding: 1,
      ...props.containerStyle,
    },
    cellStyle: {
      fontSize: "9px",
      minHeight: "15px",
      flexGrow: 1,
      width: "100%",
      overflow: "hidden",
      listStyle: "none",
    },
  });

  const generateRow = (
    items: itemType[][],
    usedWidth = props.fullWidth ?? contentContainerWidth,
    type: "header" | "row",
    isChildRow : boolean = false
  ) => {
    const isLastCell = (row: any[], rowIndex: number) => row.length - 1 <= rowIndex
    const isFirstRow = (rowIndex: number) => rowIndex === 0
    const isLastRow = (rows: any[], rowIndex: number) => rows.length - 1 <= rowIndex
    const hasHeader = () => props.headers.length > 0

    return items.map((row, rowIndex) => {
      console.groupCollapsed("GenerateRow Item");
      console.log("Item : ", row);
      const widths = calculateFlexWidths(row, usedWidth, 0, 10,props.widths);
      console.log("widths : ", widths);

      console.groupEnd();
      return row.map((cell, cellIndex) => {
        console.groupCollapsed(`GenerateRow Cell - ${cellIndex}`);
        const preparedStyles = produce({} as Style, (draft) => {
          draft.border = 0;
          draft.paddingLeft = 5
          const cellBorderStyles = borderType(cell);

          if (type === 'header') {
            draft.fontWeight = 'bold'
            // First Cell
            if (cellIndex === 0) {
              draft.borderLeft = cellBorderStyles[0] !== '' ? cellBorderStyles[0] :  isChildRow ? nullBorder : outerBorder
              draft.borderTop = cellBorderStyles[1] !== '' ? cellBorderStyles[1] : outerBorder
              draft.borderRight = cellBorderStyles[2] !== '' ? cellBorderStyles[2] : isLastCell(row,cellIndex) && isChildRow ? nullBorder: outerBorder
              draft.borderBottom = cellBorderStyles[3] !== '' ? cellBorderStyles[3] : isFirstRow(rowIndex) ? nullBorder : outerBorder
            }

            // 2nd to nth Cell
            else if (cellIndex < row.length - 1) {
              draft.borderLeft = cellBorderStyles[0] !== '' ? cellBorderStyles[0] :  nullBorder
              draft.borderTop = cellBorderStyles[1] !== '' ? cellBorderStyles[1] : outerBorder
              draft.borderRight = cellBorderStyles[2] !== '' ? cellBorderStyles[2] : isLastCell(row,cellIndex) && isChildRow ? nullBorder: outerBorder
              draft.borderBottom = cellBorderStyles[3] !== '' ? cellBorderStyles[3] : isFirstRow(rowIndex) ? nullBorder : outerBorder
            }
            // Last
            else {
              draft.borderLeft = cellBorderStyles[0] !== '' ? cellBorderStyles[0] :  nullBorder
              draft.borderTop = cellBorderStyles[1] !== '' ? cellBorderStyles[1] : outerBorder
              draft.borderRight = cellBorderStyles[2] !== '' ? cellBorderStyles[2] : isLastCell(row,cellIndex) && isChildRow ? nullBorder: outerBorder
              draft.borderBottom = cellBorderStyles[3] !== '' ? cellBorderStyles[3] : isFirstRow(rowIndex) ? nullBorder : outerBorder
            }
          }

          else if (type === 'row') {            
              // First Cell
              if (cellIndex === 0) {
                draft.borderLeft = cellBorderStyles[0] !== '' ? cellBorderStyles[0]  :  isChildRow ? nullBorder : outerBorder
                draft.borderTop = cellBorderStyles[1] !== '' ? cellBorderStyles[1] : hasHeader() ? nullBorder : isFirstRow(rowIndex) ? nullBorder : innerBorder
                draft.borderRight = cellBorderStyles[2] !== '' ? cellBorderStyles[2] : isChildRow && isLastCell(row,cellIndex) ? nullBorder : isLastCell(row,cellIndex) ? outerBorder : innerBorder
                draft.borderBottom = cellBorderStyles[3] !== '' ? cellBorderStyles[3] : isChildRow ? nullBorder : isLastRow(items, rowIndex) ? outerBorder : innerBorder
              }
              // 2nd to nth Cell
              else if (cellIndex < row.length - 1) {
                draft.borderLeft = cellBorderStyles[0] !== '' ? cellBorderStyles[0] :  nullBorder
                draft.borderTop = cellBorderStyles[1] !== '' ? cellBorderStyles[1] : isFirstRow(rowIndex) ? nullBorder : innerBorder
                draft.borderRight = cellBorderStyles[2] !== '' ? cellBorderStyles[2] : isChildRow && isLastCell(row,cellIndex) ? nullBorder : isLastCell(row,cellIndex) ? outerBorder : innerBorder
                draft.borderBottom = cellBorderStyles[3] !== '' ? cellBorderStyles[3] : isChildRow ? nullBorder : isLastRow(items, rowIndex) ? outerBorder : innerBorder
              }
              // Last
              else {
                draft.borderLeft = cellBorderStyles[0] !== '' ? cellBorderStyles[0] :  nullBorder
                draft.borderTop = cellBorderStyles[1] !== '' ? cellBorderStyles[1] : isFirstRow(rowIndex) ? nullBorder : innerBorder
                draft.borderRight = cellBorderStyles[2] !== '' ? cellBorderStyles[2] : isChildRow && isLastCell(row,cellIndex) ? nullBorder : isLastCell(row,cellIndex) ? outerBorder : innerBorder
                draft.borderBottom = cellBorderStyles[3] !== '' ? cellBorderStyles[3] : isChildRow ? nullBorder : isLastRow(items, rowIndex) ? outerBorder : innerBorder
              }
          }
        });

        console.log("PrparedStyles", preparedStyles);
        console.log("Styles", {
          ...styles.cellStyle,
          width: widths[cellIndex],
          ...preparedStyles,
        });
        console.groupEnd();
        console.groupEnd();
        return (
          <View debug
            style={{
              ...styles.cellStyle,
              width: widths[cellIndex],
              ...preparedStyles,
            }}
          >
            {isAllowedGroup(cell) ||
            (!isAllowedGroup(cell) && cell.childRows === undefined)
              ? parseInput( cell,{},
                  isAllowedGroup(cell) ||
                    (!isAllowedGroup(cell) && cell.type === undefined)
                    ? "text"
                    : cell.type
                )
              : cell.childRows
              ? generateRow(
                  cell.childRows,
                  Number(widths !== undefined && widths[cellIndex] !== undefined ? widths[cellIndex].replace(/px/g, "") : 0) - 10,
                  type, 
                  true
                )
              : ""}
          </View>
        );
      });
    });
  };

  return (
    
    <View fixed={props.fixed} style={styles.containerStyle} wrap={false}>
      {generateRow(props.headers, contentContainerWidth, "header")}
      {generateRow(props.rows, contentContainerWidth, "row")}      
    </View>
  )
}

export default FlexTable