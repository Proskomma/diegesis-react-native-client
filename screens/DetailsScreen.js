import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, LogBox } from "react-native";
import { gql, ApolloClient, InMemoryCache, useQuery } from "@apollo/client";
import { BR } from "@expo/html-elements";
import { ActivityIndicator, VStack } from "@react-native-material/core";
import { Surface, Text } from "@react-native-material/core";
import Footer from "../components/Footer";
import BookCodeSelector from "../components/BookCodeSelector";
import { Button, Center, Icon, View } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  useEffect(() => {
    let entry;
    if (data) {
      entry = JSON.stringify(data.localEntry);
    }
    if (entry) {
      AsyncStorage.getAllKeys((err, keys) => {
        if (keys.includes(`newEntry.${id}`)) {
          console.log("Key already exists !");
        } else {
          AsyncStorage.setItem(`newEntry.${id}`, entry)
            .then(() => {
              console.log("Entry Stored Successfully");
            })
            .catch((e) => console.error(e));
        }
      });
    }
  }, [data]);

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
  const entryInfo = data.localEntry;

  if (!entryInfo) {
    return <Text>Processing on server - wait a while and hit "refresh"</Text>;
  }
  const filteredStatsTab = entryInfo.bookStats.filter((bo) => bo.stat > 0);
  LogBox.ignoreAllLogs();

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          indicatorStyle="white"
        >
          <Surface>
            <Surface style={styles.modalView}>
              {!entryInfo ? (
                <VStack>
                  <ActivityIndicator size="large" color="cornflowerblue" />
                  <Text style={styles.centeredView}>Loading ...</Text>
                </VStack>
              ) : (
                <Surface>
                  <Surface>
                    <Text variant="h5" style={styles.columnText}>
                      {entryInfo.title}
                    </Text>
                    <Text variant="h6" style={styles.h6}>
                      Details
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Abrreviation :{" "}
                      </Text>
                      <Text>{entryInfo.abbreviation}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Copyright :{" "}
                      </Text>
                      <Text>{entryInfo.copyright}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Language :{" "}
                      </Text>
                      <Text>{`${entryInfo.language}, ${entryInfo.textDirection}`}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Data Source :{" "}
                      </Text>
                      <Text>{source}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Owner :{" "}
                      </Text>
                      <Text>{entryInfo.owner}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Entry ID :{" "}
                      </Text>
                      <Text>{id}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Revision :{" "}
                      </Text>
                      <Text>{revision}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Content :{" "}
                      </Text>
                      <Text>{`${entryInfo.nOT} OT, ${entryInfo.nNT} NT`}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Number of Chapters :{" "}
                      </Text>
                      <Text>{entryInfo.nChapters}</Text>
                    </Text>
                    <Text>
                      <Text variant="subtitle2" style={styles.columnText}>
                        Number of Verses :{" "}
                      </Text>
                      <Text>{entryInfo.nVerses}</Text>
                    </Text>
                    <Text variant="h6" style={styles.h6}>
                      Book Resources
                    </Text>
                    <BookCodeSelector
                      label={"Select book"}
                      bookcodes={entryInfo?.bookCodes}
                      bookCode={bookCode}
                      setBookCode={setBookCode}
                    />
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
                    {bookCode && (
                      <Button
                        style={{ width: "30%", alignSelf: "center" }}
                        leftIcon={<Icon as={Ionicons} name="book" size="sm" />}
                        onPress={() => {
                          let textDir = entryInfo.textDirection;
                          navigation.navigate("Reading", {
                            source,
                            id,
                            revision,
                            bookCode,
                            textDir,
                          });
                        }}
                      >
                        Read
                      </Button>
                    )}
                  </Surface>
                </Surface>
              )}
            </Surface>
            <Footer />
          </Surface>
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
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
    alignSelf: "center",
  },
  h6: {
    textDecorationLine: "underline",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
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
