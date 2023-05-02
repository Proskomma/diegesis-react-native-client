import { AntDesign } from "@expo/vector-icons";
import { CheckIcon, Select, View } from "native-base";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, ScrollView, LogBox } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import {
  ActivityIndicator,
  AppBar,
  Flex,
  VStack,
} from "@react-native-material/core";
import { Surface, Text } from "@react-native-material/core";
import Footer from "../components/Footer";

export default function ReadingScreen({ route }) {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });
  const source = route.params.source;
  const id = route.params.id;
  const revision = route.params.revision;
  const textDir = route.params.textDir;
  const [selectedBookCode] = useState(route.params.bookCode);

  const memoClient = useMemo(() => client);
  const [result, setResult] = useState(null);
  const [textBlocks, setTextBlocks] = useState(null);
  const [bookChapters, setBookChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [docLaoded, setDocLoaded] = useState(false);
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
    const doLoad = async () => {
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
      setDocLoaded(true);
    };
    doLoad();
  }, []);

  // runs once, when the page is rendered
  useEffect(() => {
    const doOrgs = async () => {
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
      const resultQuery = pk.gqlQuerySync(query);
      setResult(resultQuery);
      const query2 = `{ docSet (id:"${source}_${id}_${revision}") 
            { 
              document(bookCode :"${selectedBookCode}")
                {
                  cIndexes {
                    chapter
                  }
                }
            }
          }`;
      let queryResult = pk.gqlQuerySync(query2);
      setBookChapters(queryResult);
      const query3 = `{ docSet (id:"${source}_${id}_${revision}") 
            { 
              id
              document(bookCode :"${selectedBookCode}")
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
      setTextBlocks(pk.gqlQuerySync(query3));
    };
    doOrgs();
  }, [docLaoded, selectedChapter]);

  const backwardStepClick = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const forwardStepClick = () => {
    if (selectedChapter < bookChapters.data.docSet.document.cIndexes.length) {
      setSelectedChapter(selectedChapter + 1);
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  LogBox.ignoreAllLogs();

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          indicatorStyle="white"
          ref={scrollViewRef}
        >
          <Surface>
            <Surface style={styles.modalView}>
              {!result?.data?.docSet && (
                <VStack>
                  <ActivityIndicator size="large" color="cornflowerblue" />
                  <Text style={styles.centeredView}>Loading ...</Text>
                </VStack>
              )}
              {result?.data?.docSet && (
                <Surface>
                  <Text style={styles.titleText}>
                    {
                      result?.data?.docSet?.tagsKv.filter(
                        (t) => t.key === "title"
                      )[0].value
                    }{" "}
                    {"\n"}
                  </Text>
                  <Flex direction="column">
                    <Text style={{ marginTop: 7 }}>
                      {" "}
                      Select a chapter : {"\n"}
                    </Text>
                    <Select
                      placeholder={`Chapter ${selectedChapter}`}
                      selectedValue={`Chapter ${selectedChapter}`}
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
                            value={c.chapter.toString()}
                            label={`Chapter ${c.chapter}`}
                            onPress={() => {
                              setSelectedChapter(c.chapter);
                            }}
                            style={styles.textStyle}
                          ></Select.Item>
                        )
                      )}
                    </Select>
                  </Flex>
                  <Text>{"\n\n"}</Text>
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
                        <Text style={{ writingDirection: `${textDir}` }}>
                          {b.items.map((i, n) => {
                            if (i.type === "token") {
                              return i.payload;
                            } else if (
                              i.type === "scope" &&
                              i.subType === "start" &&
                              i.payload.startsWith("chapter")
                            ) {
                              return (
                                <Text
                                  key={n}
                                  style={{
                                    writingDirection: `${textDir}`,
                                    fontWeight: "bold",
                                    fontSize: 40,
                                  }}
                                  direction={textDir}
                                >
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
