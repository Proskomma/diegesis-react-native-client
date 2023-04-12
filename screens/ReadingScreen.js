import { AntDesign } from "@expo/vector-icons";
import { CheckIcon, Select } from "native-base";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import {
  ActivityIndicator,
  AppBar,
  Flex,
  VStack,
} from "@react-native-material/core";
import { Surface, Text } from "@react-native-material/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookCodeSelector from "../components/BookCodeSelector";

export default function ReadingScreen({ navigation, route }) {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });
  const [source] = useState(route.params.source);
  const [id] = useState(route.params.id);
  const [revision] = useState(route.params.revision);
  const [entryInfo] = useState(route.params.entryInfo);
  const memoClient = useMemo(() => client);
  const [result, setResult] = useState(null);
  const [textBlocks, setTextBlocks] = useState(null);
  const [bookCode, setBookCode] = useState("");
  const [bookChapters, setBookChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
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

  // runs once, when the page is rendered
  useEffect(() => {
    const doOrgs = async () => {
      const result = await memoClient.query({
        query: gql`
          {
            localEntry(source: "${source}", id: "${id}", revision: "${revision}") {
              canonResource(type: "succinct") {
                content
              }
            }
          }
        `,
      });
      const succinct = result.data.localEntry.canonResource.content;
      pk.loadSuccinctDocSet(JSON.parse(succinct));
      const query = `{ docSet (id:"${source}_${id}_${revision}") 
            { id 
              documents{
                id 
                bookCode : header(id:"bookCode")
              }
              tagsKv{
                key
                value
              }
            }
          }`;
      setResult(pk.gqlQuerySync(query));
    };
    doOrgs();
  }, [source, id, revision]);

  useEffect(() => {
    const query = `{ docSet (id:"${source}_${id}_${revision}") 
            { 
              document(bookCode :"${bookCode}")
                {
                  cIndexes {
                    chapter
                  }
                }
            }
          }`;
    setBookChapters(pk.gqlQuerySync(query));
  }, [bookCode, source, id, revision]);

  useEffect(() => {
    const query = `{ docSet (id:"${source}_${id}_${revision}") 
            { 
              id
              document(bookCode :"${bookCode}")
                {
                  mainSequence 
                  {
                    blocks(withScopes:"chapter/${selectedChapter}") { 
                      items {
                        type subType payload
                      }
                    }
                  }
                }
            }
          }`;
    setTextBlocks(pk.gqlQuerySync(query));
  }, [bookCode, selectedChapter]);

  const backwardStepClick = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    }
  };

  const forwardStepClick = () => {
    if (selectedChapter < bookChapters.data.docSet.document.cIndexes.length) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  return (
    <ScrollView style={styles.container} indicatorStyle="white">
      <Surface>
        <Header navigation={navigation} />
        <Surface style={styles.modalView}>
          {!result && (
            <VStack>
              <ActivityIndicator size="large" color="cornflowerblue" />
              <Text style={styles.centeredView}>Loading ...</Text>
            </VStack>
          )}
          {result && (
            <Surface>
              <Text style={styles.titleText}>
                {
                  result?.data?.docSet?.tagsKv.filter(
                    (t) => t.key === "title"
                  )[0].value
                }{" "}
                {"\n"}
              </Text>
              <VStack>
                <BookCodeSelector
                  label={"Select book"}
                  bookcodes={entryInfo?.bookCodes}
                  bookCode={bookCode}
                  setBookCode={setBookCode}
                />
                <Text>{"\n\n"}</Text>
              </VStack>
              {!bookCode && !textBlocks?.data?.docSet?.document ? (
                <Text style={styles.centeredView}>
                  No Book Selected Yet ...
                </Text>
              ) : (
                <Flex direction="row">
                  <Text style={{ marginTop: 7 }}>
                    {" "}
                    Select a chapter : {"\n"}
                  </Text>
                  <Select
                    placeholder="Please Choose Chapter"
                    defaultValue={selectedChapter}
                    selectedValue={selectedChapter}
                    mt={1}
                    _selectedItem={{
                      bg: "#d3d3d3",
                      endIcon: <CheckIcon size="5" />,
                    }}
                  >
                    {bookChapters?.data?.docSet?.document?.cIndexes?.map(
                      (c, n) => (
                        <Select.Item
                          key={n}
                          value={c.chapter}
                          label={c.chapter}
                          onPress={() => setSelectedChapter(c.chapter)}
                          style={styles.textStyle}
                        ></Select.Item>
                      )
                    )}
                  </Select>
                </Flex>
              )}
              <Text>{"\n\n"}</Text>
              {!selectedChapter && textBlocks?.data?.docSet?.document ? (
                <Text style={styles.centeredView}>
                  No Chapter Selected Yet ...
                </Text>
              ) : (
                <>
                  {textBlocks?.data?.docSet?.document?.mainSequence?.blocks && (
                    <Surface>
                      <AppBar
                        leading={() => (
                          <AntDesign
                            name="caretleft"
                            style={styles.backwardArrow}
                            onPress={() => backwardStepClick()}
                          />
                        )}
                        trailing={() => (
                          <AntDesign
                            name="caretright"
                            style={styles.forwardArrow}
                            onPress={() => forwardStepClick()}
                          />
                        )}
                        transparent="true"
                      />
                    </Surface>
                  )}
                  {textBlocks?.data?.docSet?.document?.mainSequence?.blocks?.map(
                    (b, n) => (
                      <Surface key={n}>
                        <Text>
                          {b.items.map((i, n) => {
                            if (i.type === "token") {
                              return i.payload;
                            } else if (
                              i.type === "scope" &&
                              i.subType === "start" &&
                              i.payload.startsWith("chapter")
                            ) {
                              return (
                                <Text key={n} style={styles.chapterText}>
                                  {i.payload.split("/")[1]}
                                  {"\n"}
                                </Text>
                              );
                            } else if (
                              i.type === "scope" &&
                              i.subType === "start" &&
                              i.payload.startsWith("verses")
                            ) {
                              return (
                                <Text key={n} style={styles.versesText}>
                                  {i.payload.split("/")[1]}{" "}
                                </Text>
                              );
                            } else {
                              return "";
                            }
                          })}
                          {"\n\n"}
                        </Text>
                      </Surface>
                    )
                  )}
                  {textBlocks?.data?.docSet?.document?.mainSequence?.blocks && (
                    <Surface>
                      <AppBar
                        leading={() => (
                          <AntDesign
                            name="caretleft"
                            style={styles.backwardArrow}
                            onPress={() => backwardStepClick()}
                          />
                        )}
                        trailing={() => (
                          <AntDesign
                            name="caretright"
                            style={styles.forwardArrow}
                            onPress={() => forwardStepClick()}
                          />
                        )}
                        transparent="true"
                      />
                    </Surface>
                  )}
                </>
              )}
            </Surface>
          )}
        </Surface>
        <Footer />
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
