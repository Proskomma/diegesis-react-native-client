import { Spinner } from "native-base";
import { useState } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, useQuery } from "@apollo/client";
import { searchQuery } from "../lib/search";
import { BR } from "@expo/html-elements";
import Footer from "../components/Footer";
import DetailsScreen from "./DetailsScreen";
import Header from "../components/Header";
const pk = new Proskomma([
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
]);

export default function ListScreen({navigation}) {
  const [currentVersion, setCurrentVersion] = useState({
    source: "",
    transId: "",
    revision: "",
  });
  const [searchOrg, setSearchOrg] = useState("all");
  const [searchOwner, setSearchOwner] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchLang, setSearchLang] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState("title");
  const [features, setFeatures] = useState({
    introductions: false,
    headings: false,
    footnotes: false,
    xrefs: false,
    strong: false,
    lemma: false,
    gloss: false,
    content: false,
    occurrences: false,
  });
  searchTerms = {
    org: searchOrg,
    owner: searchOwner,
    resourceType: searchType,
    lang: searchLang,
    text: searchText,
    features: features,
    sortField: sortField,
  };
  const queryString = searchQuery(
    `query {
          localEntries%searchClause% {
            source
            types
            transId
            language
            owner
            revision
            title
          }
      }`,
    searchTerms
  );

  const { loading, error, data } = useQuery(
    gql`
      ${queryString}
    `
  );

  const tableHead = ["Resource Types", "Source", "Language", "Title"];

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <GqlError error={error} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation}/>
      <View style={styles.modalView}>
        <View>
          {data.localEntries?.map((el, kv) => {
            return (
              <View key={kv}>
                <Text>
                  <Text>Book Number :</Text>
                  <Text>{kv + 1}</Text>
                </Text>
                <Text>
                  <Text>Resource Types : </Text>
                  <Text>{el.types}</Text>
                </Text>
                <Text>
                  <Text>Source : </Text>
                  <Text>{`${el.owner}@${el.source}`}</Text>
                </Text>
                <Text>
                  <Text>Language : </Text>
                  <Text>{el.language}</Text>
                </Text>
                <Text>
                  <Text>Title : </Text>
                  <Text
                    onPress={() => {
                      setCurrentVersion({
                        ...currentVersion,
                        source : el.source,
                        transId : el.transId,
                        revision : el.revision.replace(/\s/g, "__"),
                      });
                    }}
                    style={styles.clickableText}
                  >
                    {el.title}
                  </Text>
                </Text>
                <BR />
              </View>
            );
          })}
        </View>
        {currentVersion.source !== "" && currentVersion.transId !== "" && currentVersion.revision !== "" && (
          <DetailsScreen source={currentVersion.source} id={currentVersion.transId} revision={currentVersion.revision} />
        )}
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  clickableText: {
    color: "blue",
  },
  container: { flex: 1 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  modalView: {
    margin: 10,
  },
});
