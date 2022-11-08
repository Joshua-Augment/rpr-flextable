import React from 'react'
import Html from 'react-pdf-html';
// import { parseContentBlock } from './components/core';

interface StringParserProps {
  children : string
}

// const bracketFinder = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>|<([A-Z][A-Z0-9]*).*?\/>/gi;
// const nodeFinder =  /<([A-Z][A-Z0-9]*)\b[^>]*>/gi
// const classFinder = /class="([^"]+)"/g
const StringParser = (props: StringParserProps) => { 

  return (
    <Html style={{ fontSize: '10px' }}>{props.children}</Html>
  )
}

export default StringParser