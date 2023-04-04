import { Spinner } from "native-base";
import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, useQuery } from "@apollo/client";
import { searchQuery } from "../lib/search";
import { H2, Table, TBody, TD, TH, THead, TR } from "@expo/html-elements";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Stack, Surface, Text } from "@react-native-material/core";
import { ActivityIndicator } from "@react-native-material/core";
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
    return (
      <Stack fill center spacing={4}>
        <ActivityIndicator size="large" color="cornflowerblue" />
      </Stack>
    );
  }
  if (error) {
    return <GqlError error={error} />;
  }
  return (
    <ScrollView style={styles.container}>
      <Header navigation={navigation} />
      <Surface>
        <Text variant="h5" style={styles.titleText}>
          Entries
        </Text>
        <Surface>
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
                        const source = el.source;
                        const id = el.transId;
                        const revision = el.revision;
                        navigation.navigate("Details", {
                          source,
                          id,
                          revision,
                        });
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
        </Surface>
      </Surface>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  clickableText: {
    color: "blue",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  container: { flex: 1 },
  table: {
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: "5px",
    margin: 10,
  },
  rows: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
});
