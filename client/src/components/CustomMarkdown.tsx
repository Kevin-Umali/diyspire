import { Heading, List, ListItem, Code, Table, Thead, Tbody, Tr, Th, Td, Divider, Kbd, Text, Image, Box, Link, BoxProps, TextProps, useColorMode } from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

const StyledBlockquote: React.FC<BoxProps> = (props) => <Box as="blockquote" borderLeft="4px" borderColor="gray.300" pl={4} py={2} fontStyle="italic" {...props} />;

const MarkdownPre: React.FC<{
  children: {
    props: {
      className: string | string[];
      children?: string;
    };
  };
}> = ({ children }) => {
  const { colorMode } = useColorMode();
  console.log("children", children.props);
  const language = typeof children.props.className === "string" ? children.props.className.replace("language-", "").replace("lang-", "") : undefined;
  console.log("language", language);
  const style = colorMode === "dark" ? materialDark : oneLight;

  if (typeof children.props.children === "string") {
    return (
      <SyntaxHighlighter language={language} style={style}>
        {children.props.children}
      </SyntaxHighlighter>
    );
  }
  return null;
};

const DL: React.FC<BoxProps> = (props) => <Box as="dl" {...props} />;
const DT: React.FC<TextProps> = (props) => <Text as="dt" fontWeight="bold" {...props} />;
const DD: React.FC<BoxProps> = (props) => <Box as="dd" ml={4} {...props} />;

interface CustomMarkdownrProps {
  content: string;
}

const CustomMarkdown: React.FC<CustomMarkdownrProps> = ({ content }) => {
  return (
    <Markdown
      options={{
        overrides: {
          h1: { component: Heading, props: { as: "h1", size: "xl", mb: 6 } },
          h2: { component: Heading, props: { as: "h2", size: "lg", mb: 5 } },
          h3: { component: Heading, props: { as: "h3", size: "md", mb: 4 } },
          h4: { component: Heading, props: { as: "h4", size: "sm", mb: 4 } },
          h5: { component: Heading, props: { as: "h5", size: "xs", mb: 3 } },
          h6: { component: Heading, props: { as: "h6", size: "xs", mb: 3 } },
          p: { component: Text, props: { mb: 5 } },
          ul: { component: List, props: { styleType: "disc", ml: 4, mb: 4 } },
          ol: { component: List, props: { styleType: "decimal", ml: 4, mb: 4 } },
          li: { component: ListItem, props: { mb: 3 } },
          a: { component: Link, props: { mb: 2, textDecorationLine: "underline" } },
          img: { component: Image, props: { mb: 4, loading: "lazy" } },
          pre: {
            component: MarkdownPre,
            props: { mb: 4 },
          },
          code: Code,
          blockquote: { component: StyledBlockquote, props: { mb: 4 } },
          table: Table,
          thead: Thead,
          tbody: Tbody,
          tr: Tr,
          th: Th,
          td: Td,
          hr: { component: Divider, props: { my: 4 } },
          kbd: Kbd,
          dl: { component: DL, props: { mb: 4 } },
          dt: { component: DT, props: { mb: 2 } },
          dd: { component: DD, props: { mb: 2 } },
        },
      }}
    >
      {content}
    </Markdown>
  );
};

export default CustomMarkdown;
