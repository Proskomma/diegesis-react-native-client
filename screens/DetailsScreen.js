import { AntDesign } from "@expo/vector-icons";
import { CheckIcon, Select } from "native-base";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { Proskomma } from "proskomma-core";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
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

export default function DetailsScreen({navigation, route}) {
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
  }, [source,id,revision]);

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
  }, [bookCode,source,id,revision]);
  
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
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.modalView}>
          {!result ? (
            <Text style={styles.centeredView}>Loading ...</Text>
          ) : (
            <>
              <Text style={styles.titleText}>
                {
                  result?.data?.docSet?.tagsKv.filter(
                    (t) => t.key === "title"
                  )[0].value
                }{" "}
                {"\n"}
              </Text>
              {
                <View>
                  <Text style={styles.listStyle}>
                    {" "}
                    Select a book code : {"\n"}
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
                    {result?.data?.docSet?.documents?.map((kv, n) => (
                      <Select.Item
                        key={n}
                        value={kv["bookCode"].toString()}
                        label={kv["bookCode"]}
                        onPress={() => setBookCode(kv["bookCode"])}
                        style={styles.textStyle}
                      ></Select.Item>
                    ))}
                  </Select>
                </View>
              }
              <Text>{"\n\n"}</Text>
              {!textBlocks?.data?.docSet?.document ? (
                <Text style={styles.centeredView}>
                  No Book Selected Yet ...
                </Text>
              ) : (
                <View>
                  <Text style={styles.listStyle}>
                    {" "}
                    Select a specified book chapter : {"\n"}
                  </Text>
                  <Select
                    placeholder="Please Choose Book Chapter"
                    selectedValue={selectedChapter}
                    minWidth="200"
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
                          value={c["chapter"].toString()}
                          label={c["chapter"]}
                          onPress={() => setSelectedChapter(c["chapter"])}
                          style={styles.textStyle}
                        ></Select.Item>
                      )
                    )}
                  </Select>
                </View>
              )}
              <Text>{"\n\n"}</Text>
              {!selectedChapter && textBlocks?.data?.docSet?.document ? (
                <Text style={styles.centeredView}>
                  No Chapter Selected Yet ...
                </Text>
              ) : (
                <>
                  {textBlocks?.data?.docSet?.document?.mainSequence?.blocks && (
                    <View style={styles.head}>
                      <AntDesign
                        style={styles.backwardArrow}
                        name="stepbackward"
                        onPress={() => backwardStepClick()}
                      />
                      <Text>{"                                 "}</Text>
                      <AntDesign
                        style={styles.forwardArrow}
                        name="stepforward"
                        onPress={() => forwardStepClick()}
                      />
                    </View>
                  )}
                  {textBlocks?.data?.docSet?.document?.mainSequence?.blocks?.map(
                    (b, n) => (
                      <View key={n}>
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
                      </View>
                    )
                  )}
                  {textBlocks?.data?.docSet?.document?.mainSequence?.blocks && (
                    <View style={styles.head}>
                      <AntDesign
                        style={styles.backwardArrow}
                        name="stepbackward"
                        onPress={() => backwardStepClick()}
                      />
                      <Text>{"                                 "}</Text>
                      <AntDesign
                        style={styles.forwardArrow}
                        name="stepforward"
                        onPress={() => forwardStepClick()}
                      />
                    </View>
                  )}
                </>
              )}
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
