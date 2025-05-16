import { StoryObj, Meta } from "@storybook/react";
import { NodeTeaser } from "@dg/ui/organisms/NodeTeaser";

const meta: Meta<typeof NodeTeaser> = {
  title: "Organisms/NodeTeaser",
  component: NodeTeaser,
  decorators: [
    (Story) => (
      <div style={{ background: "#fff", padding: "0" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    path: {
      control: "text",
    },
    title: {
      control: "text",
    },
    image_url: {
      control: "text",
    },
    image_alt: {
      control: "text",
    },
  },
  args: {
    path: "https://www.digitalist.fi",
    title: "Node teaser",
    image_url: "https://placehold.co/693x377",
    image_alt: "node teaser image",
  },
};
export default meta;
export const nodeTeaser: StoryObj<typeof NodeTeaser> = {
  render: ({ path: nodePath, ...rest }) => {
    return <NodeTeaser path={nodePath ?? "https://www.digitalist.fi"} {...rest} />;
  },
};
