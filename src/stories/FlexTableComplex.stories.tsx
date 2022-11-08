import React from 'react';
import { Page,Document } from '@react-pdf/renderer';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import FlexTable from '../components/FlexTable/FlexTable';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/FlexTable/Complex',
  component: FlexTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof FlexTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FlexTable> = (args) => <Document><Page size="A4"><FlexTable {...args} /></Page></Document>;

export const CompoundHeader = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CompoundHeader.args = {
  headers: [
    [{text:'Colors of Fruits',styles:{width:'900px'}}],
    ["ID", "Fruit","Color"],
  ],
  widths: [50],
  rows : [
    [1,"Orange","Orange"],
    [2,"Banana","Yellow"],
    [3,"Apple","Red"],
    [4,"Kiwi","Green"],
    [5,"Durian","Yellow"],
    [6,"Rambutan","Red"],
    [7,"Lime","Green"],
  ]
};

export const ChildRows = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ChildRows.args = {
  headers: [
    [{text:'Colors of Fruits',styles:{width:'900px'}}],
    ["ID", {text:'',childRows: [["Fruit", "FruitID"]]},"Color"],
  ],
  widths: [50],
  rows : [
    [1,{text:'', childRows : [["Orange",1]]},"Orange"],
    [2,{text:'', childRows : [["Banana",1]]},"Yellow"],
    [3,{text:'', childRows : [["Apple",1]]},"Red"],
    [4,{text:'', childRows : [["Kiwi",1]]},"Green"],
    [5,{text:'', childRows : [["Durian",1]]},"Yellow"],
    [6,{text:'', childRows : [["Rambutan",1]]},"Red"],
    [7,{text:'', childRows : [["Lime",1]]},"Green"],
  ]
};