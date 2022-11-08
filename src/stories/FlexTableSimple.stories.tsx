import React from 'react';
import { Page,Document } from '@react-pdf/renderer';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import FlexTable from '../components/FlexTable/FlexTable';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/FlexTable/Simple',
  component: FlexTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof FlexTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FlexTable> = (args) => <Document><Page size="A4"><FlexTable {...args} /></Page></Document>;

export const SimpleTable = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SimpleTable.args = {
  headers: [["ID", "Fruit","Color"]],
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
export const SimpleTableWithWidths = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
SimpleTableWithWidths.args = {
  headers: [["ID", "Fruit","Color"]],
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