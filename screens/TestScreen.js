import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, ScrollView, LogBox } from "react-native";
import { Proskomma } from "proskomma-core";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { renderers } from "../renderer/render2reactNative";
import { SofriaRenderFromProskomma } from "proskomma-json-tools";
import sofria2WebActions from "../renderer/sofria2web";
import { Text, View } from "native-base";

export default function TestScreen() {
  const client = new ApolloClient({
    uri: "https://cjvh.proskomma.bible",
    cache: new InMemoryCache(),
  });

  const memoClient = useMemo(() => client);
  const scrollViewRef = useRef(null);
  const [pk, setPk] = useState(
    new Proskomma([
      {
        name: "source",
        type: "string",
        regex: "^[^\\s]+$",
      },
      {
        name: "project",
        type: "string",
        regex: "^[^\\s]+$",
      },
      {
        name: "revision",
        type: "string",
        regex: "^[^\\s]+$",
      },
    ])
  );
  useEffect(() => {
    const docResult = pk.gqlQuerySync(`{documents {
      docSetId
      id
    }
  }`);
    console.log(docResult);
  }, []);

  LogBox.ignoreAllLogs();

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Text>test </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  listStyle: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: "5%",
  },
  textStyle: {
    color: "red",
    fontWeight: "bold",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 42,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  chapterText: {
    fontWeight: "bold",
    fontSize: 40,
  },
  versesText: {
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 12,
    verticalAlign: "top",
  },
  head: {
    flex: 1,
    flexDirection: "row",
  },
  backwardArrow: {
    marginTop: "2%",
    textAlign: "left",
    color: "black",
    fontSize: 20,
  },
  forwardArrow: {
    marginTop: "2%",
    textAlign: "right",
    color: "black",
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
