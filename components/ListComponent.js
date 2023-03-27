import { Spinner } from "native-base";
import { useState } from "react";
import { StyleSheet, Text, ScrollView, View, Linking } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, useQuery } from "@apollo/client";
import { searchQuery } from "../lib/search";
import { BR} from "@expo/html-elements";
import { useRouter } from "expo-router";
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

export default function ListComponent() {
  const router = useRouter();
  const [source, setSource] = useState("");
  const [transId, setTransId] = useState("");
  const [revision, setRevision] = useState("");
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

  console.log(source);
  console.log(revision);
  console.log(transId);
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.titleText}>List Page</Text>
        <View>
          {data.localEntries?.map((el, kv) => {
            return (
              <View>
                <Text>
                  <Text>Book Number :</Text>
                  <Text>{kv}</Text>
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
                      setSource(el.source);
                      setTransId(el.transId);
                      setRevision(el.revision);
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
      </View>
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
  container: { flex: 1, paddingTop: 30 },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
});
