import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, useQuery } from "@apollo/client";
import { searchQuery } from "../lib/search";
import Footer from "../components/Footer";
import { SimpleAccordion } from "react-native-simple-accordion";
import { ListItem, Surface, Text } from "@react-native-material/core";
import { ActivityIndicator } from "@react-native-material/core";
import { Center, View } from "native-base";
import { createStackNavigator } from "@react-navigation/stack";

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
  const Stack = createStackNavigator();

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

  const searchTerms = {
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
      <Center flex={1} px="3">
        <ActivityIndicator size="large" color="cornflowerblue" />
        <Text>{"\n"}</Text>
        <Text>Loading ...</Text>
      </Center>
    );
  }
  if (error) {
    return <GqlError error={error} />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          indicatorStyle="white"
        >
          <Surface>
            <Text variant="h5" style={styles.titleText}>
              Entries
            </Text>
            <Surface>
              {data.localEntries.map((el, kv) => {
                return (
                  <Surface key={kv}>
                    <SimpleAccordion
                      title={el.title}
                      viewInside={
                        <Surface>
                          <ListItem
                            title={<Text>Resource types : {el.types}</Text>}
                            pressEffect="none"
                          />
                          <ListItem
                            title={
                              <Text>Source : {`${el.owner}@${el.source}`}</Text>
                            }
                            pressEffect="none"
                          />
                          <ListItem
                            title={<Text>Language Code : {el.language}</Text>}
                            pressEffect="none"
                          />
                          <ListItem
                            title={
                              <Text style={styles.clickableText}>
                                click for more details ...
                              </Text>
                            }
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
                            color="blue"
                          />
                        </Surface>
                      }
                      bannerStyle={{ backgroundColor: "whitesmoke" }}
                    />
                  </Surface>
                );
              })}
            </Surface>
          </Surface>
          <Footer />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
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
  table: {
    borderWidth: 2,
    borderStyle: "solid",
    margin: 10,
  },
  rows: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
