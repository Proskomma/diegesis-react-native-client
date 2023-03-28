import { Spinner } from "native-base";
import { useState } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, useQuery } from "@apollo/client";
import { searchQuery } from "../lib/search";
import { Table, TBody, TD, TH, THead, TR } from "@expo/html-elements";
import Footer from "../components/Footer";
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

export default function ListScreen({ navigation }) {
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

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <GqlError error={error} />;
  }
console.log(data.localEntries)
  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.modalView}>
        <View>
          <Table style={styles.table}>
            <THead>
              <TR>
                <TH style={styles.rows}>Resource Types</TH>
                <TH style={styles.rows}>Source</TH>
                <TH style={styles.rows}>Language</TH>
                <TH style={styles.rows}>Title</TH>
              </TR>
            </THead>
            <TBody>
              {data.localEntries?.map((el, kv) => {
                return (
                  <TR key={kv} style={styles.rows}>
                    <TD style={styles.rows}>{el.types}</TD>
                    <TD style={styles.rows}>{`${el.owner}@${el.source}`}</TD>
                    <TD style={styles.rows}>{el.language}</TD>
                    <TD
                      onPress={() => {
                        source = el.source ;
                        id = el.transId;
                        revision = el.revision;
                        navigation.navigate('Details', {source , id , revision});
                      }}
                      style={styles.clickableText}
                    >
                      {el.title}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </View>
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
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  container: { flex: 1 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  modalView: {
    margin: 10,
  },
  table: {
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: "5px",
  },
  rows: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
});
