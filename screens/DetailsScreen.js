import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { CheckIcon, Select, Spinner } from "native-base";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, ApolloClient, InMemoryCache, useQuery } from "@apollo/client";
import { H2, Table, TD, TH, TR } from "@expo/html-elements";

export default function DetailsScreen({ navigation, route }) {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });
  const [source] = useState(route.params.source);
  const [id] = useState(route.params.id);
  const [revision] = useState(route.params.revision);
  const memoClient = useMemo(() => client);
  const [result, setResult] = useState(null);
  const [textBlocks, setTextBlocks] = useState(null);
  const [bookCode, setBookCode] = useState("");
  const [bookChapters, setBookChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
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

  const queryString = `query {
    localEntry(
      source:"""%source%"""
      id: """%entryId%"""
      revision: """%revision%"""
    ) {
      language
      title
      textDirection
      script
      copyright
      abbreviation
      owner
      nOT : stat(field :"nOT")
      nNT : stat(field :"nNT")
      nDC : stat(field :"nDC")
      nChapters : stat(field :"nChapters")
      nVerses : stat(field :"nVerses")
      bookCodes
    }
  }`
    .replace("%source%", source)
    .replace("%entryId%", id)
    .replace("%revision%", revision);

  const { loading, error, data } = useQuery(
    gql`
      ${queryString}
    `
  );
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <GqlError error={error} />;
  }
  const entryInfo = data.localEntry;

  if (!entryInfo) {
    return <Text>Processing on server - wait a while and hit "refresh"</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.modalView}>
          {!entryInfo ? (
            <Text style={styles.centeredView}>Loading ...</Text>
          ) : (
            <>
              <FontAwesome5
                name="book-open"
                size={24}
                color="black"
                onPress={() =>
                  navigation.navigate("Reading", { source, id, revision })
                }
              />
              <View>
                <H2>{entryInfo.title}</H2>
                <Text>Abrreviation : {entryInfo.abbreviation}</Text>
                <Text>Copyright : {entryInfo.copyright}</Text>
                <Text>
                  Language :{" "}
                  {`${entryInfo.language}, ${entryInfo.textDirection}`}
                </Text>
                <Text>Data Source : {entryInfo.source}</Text>
                <Text>Owner : {entryInfo.owner}</Text>
                <Text>Entry ID : {id}</Text>
                <Text>Revision : {revision}</Text>
                <Text>
                  Content : {`${entryInfo.nOT} OT, ${entryInfo.nNT} NT`}
                </Text>
                <Text>Number of Chapters : {entryInfo.nChapters}</Text>
                <Text>Number of Verses : {entryInfo.nVerses}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  listStyle: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: "15%",
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
    justifyContent: "center",
    alignItems: "center",
  },
  chapterText: {
    textAlign: "left",
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
});
