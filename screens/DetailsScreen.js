import { FontAwesome5 } from "@expo/vector-icons";
import { CheckIcon, Select } from "native-base";
import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { gql, ApolloClient, InMemoryCache, useQuery } from "@apollo/client";
import { BR } from "@expo/html-elements";
import { ActivityIndicator, Stack } from "@react-native-material/core";
import { Surface, Text } from "@react-native-material/core";

export default function DetailsScreen({ navigation, route }) {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });
  const [source] = useState(route.params.source);
  const [id] = useState(route.params.id);
  const [revision] = useState(route.params.revision);
  const [bookCode, setBookCode] = useState("");

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
      bookStats(bookCode: "%bookCode%"){
        stat
        field
      }
      bookCodes
    }
  }`
    .replace("%source%", source)
    .replace("%entryId%", id)
    .replace("%revision%", revision)
    .replace("%bookCode%", bookCode);

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
  const entryInfo = data.localEntry;

  if (!entryInfo) {
    return <Text>Processing on server - wait a while and hit "refresh"</Text>;
  }

  const filteredStatsTab = entryInfo.bookStats.filter((bo) => bo.stat > 0);

  return (
    <ScrollView style={styles.container}>
      <Surface>
        <Surface style={styles.modalView}>
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
              <Surface>
                <Text variant="h5" style={styles.columnText}>
                  {entryInfo.title}
                </Text>
                <BR />
                <BR />
                <Text variant="h6" style={styles.h6}>
                  Details
                </Text>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Abrreviation :
                  </Text>
                  <Text>{entryInfo.abbreviation}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Copyright :{" "}
                  </Text>
                  <Text>{entryInfo.copyright}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Language :{" "}
                  </Text>
                  <Text>{`${entryInfo.language}, ${entryInfo.textDirection}`}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Data Source :{" "}
                  </Text>
                  <Text>{source}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Owner :{" "}
                  </Text>
                  <Text>{entryInfo.owner}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Entry ID :{" "}
                  </Text>
                  <Text>{id}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Revision :{" "}
                  </Text>
                  <Text>{revision}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Content :{" "}
                  </Text>
                  <Text>{`${entryInfo.nOT} OT, ${entryInfo.nNT} NT`}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Number of Chapters :{" "}
                  </Text>
                  <Text>{entryInfo.nChapters}</Text>
                </Text>
                <BR></BR>
                <Text>
                  <Text variant="subtitle2" style={styles.columnText}>
                    Number of Verses :{" "}
                  </Text>
                  <Text>{entryInfo.nVerses}</Text>
                </Text>
                <BR></BR>
                <Text variant="h6" style={styles.h6}>
                  Book Resources
                </Text>
                <Select
                  placeholder="Please Choose Book Code"
                  selectedValue={bookCode}
                  minWidth="200"
                  mt={1}
                  _selectedItem={{
                    bg: "#d3d3d3",
                    endIcon: <CheckIcon size="5" />,
                  }}
                >
                  {entryInfo?.bookCodes?.map((kv, n) => (
                    <Select.Item
                      key={n}
                      value={kv.toString()}
                      label={kv}
                      onPress={() => setBookCode(kv)}
                      style={styles.textStyle}
                    ></Select.Item>
                  ))}
                </Select>
                <BR></BR>
                {bookCode !== "" &&
                  filteredStatsTab.map((bo, n) => (
                    <Surface key={n}>
                      <Text>
                        <Text variant="subtitle2" style={styles.columnText}>
                          {bo.field.substring(1)} :{" "}
                        </Text>
                        <Text>{bo.stat}</Text>
                      </Text>
                      <BR></BR>
                    </Surface>
                  ))}
              </Surface>
            </>
          )}
        </Surface>
      </Surface>
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
  columnText: {
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  h6: {
    textDecorationLine: "underline",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
});
