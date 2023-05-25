import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  renderStyles as rs,
  ConvertCssToReactNativeStyle,
} from "./renderStyles";
import { StyleSheet } from "react-native";

let convertedStyleSheet = ConvertCssToReactNativeStyle(rs);
const styles = StyleSheet.create(convertedStyleSheet);

const getStyles = (type, subType) => {
  if (!styles[type]) {
    throw new Error(`Unknown style type '${type}'`);
  }
  if (!styles[type][subType]) {
    console.log(`No styles for ${type}/${subType}`);
    return styles[type].default;
  }
  return { ...styles[type].default, ...styles[type][subType] };
};

function InlineElement(props) {
  const [display, setDisplay] = useState(false);
  const toggleDisplay = () => setDisplay(!display);

  if (display) {
    return (
      <Text
        style={{
          ...props.style,
          paddingLeft: 8,
          paddingRight: 8,
          backgroundColor: "#CCC",
          marginBottom: 16,
        }}
        onPress={toggleDisplay}
      >
        {props.children}
      </Text>
    );
  } else {
    return (
      <Text
        style={{
          verticalAlign: "top",
          fontSize: 10,
          fontWeight: "bold",
          marginRight: 4,
          marginLeft: 4,
          marginTop: 15,
          padding: 2,
          backgroundColor: "#CCC",
        }}
        onPress={toggleDisplay}
      >
        {props.linkText}
      </Text>
    );
  }
}
const renderers = {
  text: (text) => {
    return (
      <View key={Math.random()} style={{ paddingTop: 20 }}>
        <Text>{text}</Text>
      </View>
    );
  },
  chapter_label: (number) => (
    <View key={Math.random()}>
      <Text
        style={{
          ...getStyles("marks", "chapter_label"),
        }}
      >
        {number}
      </Text>
    </View>
  ),
  verses_label: (number, bcv, bcvCallback) =>
    bcv && bcv.length === 3 ? (
      <Text
        onClick={() => bcvCallback(bcv)}
        style={{
          ...getStyles("marks", "verses_label"),
          textDecoration: "underline",
          color: "#00D",
        }}
      >
        {number}
      </Text>
    ) : (
      <View
        key={Math.random()}
        style={{ flexDirection: "row", paddingTop: 10 }}
      >
        <Text
          style={{
            ...getStyles("marks", "verses_label"),
            marginRight: 10,
          }}
        >
          {number}
        </Text>
      </View>
    ),
  paragraph: (subType, content, footnoteNo) => {
    let TitleContent = {};

    if (["usfm:mt", "usfm:s"].includes(subType)) {
      const updatedContent = content.map((element) => {
        const updatedChildren = React.Children.map(
          element.props.children,
          (child, index) => {
            return React.cloneElement(child, {
              style: {
                ...getStyles("paras", subType),
                display: "flex",
                flexDirection: "column",
              },
            });
          }
        );
        return React.cloneElement(element, {}, updatedChildren);
      });
      TitleContent = updatedContent;
    }
    return ["usfm:f", "usfm:x"].includes(subType) ? (
      <InlineElement
        style={getStyles("paras", subType)}
        linkText={subType === "usfm:f" ? `${footnoteNo}` : "*"}
      >
        {content}
      </InlineElement>
    ) : ["usfm:mt", "usfm:s"].includes(subType) ? (
      <View style={{ flexDirection: "row" }}>{TitleContent}</View>
    ) : (
      <View
        key={`paragraph ${Math.random()}  `}
        style={{
          ...getStyles("paras", subType),
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        {content}
      </View>
    );
  },

  wrapper: (subType, content) => (
    <View key={Math.random()} style={getStyles("wrappers", subType)}>
      {content}
    </View>
  ),
  wWrapper: (atts, content) =>
    Object.keys(atts).length === 0 ? (
      content
    ) : (
      <View
        key={Math.random()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text>{content}</Text>
        {Object.entries(atts).map((a) => (
          <Text
            key={Math.random()}
            style={{
              fontSize: 9,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {`${a[0]} = ${a[1]}`}
          </Text>
        ))}
      </View>
    ),
  mergeParas: (paras) => paras,
};

export { renderers };
