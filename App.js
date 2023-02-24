import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, ScrollView, View, Button } from "react-native";
// const { Proskomma } = require("proskomma-core");
import { Proskomma } from "proskomma-core";
import {
  ApolloProvider,
  gql,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";
import { Select, NativeBaseProvider, CheckIcon } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
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

export default function App() {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });
  const memoClient = useMemo(() => client);
  const [result, setResult] = useState(null);
  const [textBlocks, setTextBlocks] = useState(null);
  const [bookCode, setBookCode] = useState("");
  // runs once, when the page is rendered
  useEffect(() => {
    const doOrgs = async () => {
      const result = await memoClient.query({
        query: gql`
          {
            localEntry(source: "eBible", id: "engBBE", revision: "2020-04-17") {
              canonResource(type: "succinct") {
                content
              }
            }
          }
        `,
      });
      const succinct = result.data.localEntry.canonResource.content;
      pk.loadSuccinctDocSet(JSON.parse(succinct));
      const query = `{ docSet (id:"eBible_engBBE_2020-04-17") 
      { id 
        documents{
          id 
          bookCode : header(id:"bookCode")
        }
      }
    }`;
      setResult(pk.gqlQuerySync(query));
    };
    doOrgs();
  }, []);

  useEffect(() => {
    const query = `{ docSet (id:"eBible_engBBE_2020-04-17") 
      { 
        id
        document(bookCode :"${bookCode}")
          {
            mainSequence 
            {
              blocksText
              blocks { 
                items {
                  type subType payload
                }
              }
            }
          }
      }
    }`;
    setTextBlocks(pk.gqlQuerySync(query));
  }, [bookCode]);
  
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <ScrollView style={styles.container}>
          <View>
            <View style={styles.modalView}>
              <Text style={styles.titleText}> Content {"\n"}</Text>
              {!result ? (
                <Text style={styles.centeredView}>Loading ...</Text>
              ) : (
                <>
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
                            value={kv["bookCode"]}
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
                    textBlocks?.data?.docSet?.document?.mainSequence?.blocks?.map(
                      (b, n) => (
                        <View key={n}>
                          <Text>
                            {b.items.map((i,n)=>{
                              if(i.type === 'token'){
                                return i.payload
                              }
                              else if (i.type === 'scope' && i.subType === "start" && i.payload.startsWith('chapter')){
                                return <Text key={n} style={styles.chapterText}>{i.payload.split('/')[1]}{"\n"}</Text>
                              }
                              else if (i.type === 'scope' && i.subType === "start" && i.payload.startsWith('verses')){
                                return <Text key={n} style={styles.versesText}>{i.payload.split('/')[1]}{" "} </Text>
                              }
                              else {return ""}
                            })}
                            {"\n\n"}
                          </Text>
                        </View>
                      )
                    )
                  )}
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </NativeBaseProvider>
    </ApolloProvider>
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
  },
  textStyle: {
    color: "red",
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: "grey",
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  chapterText : {
    textAlign:'left',
    fontWeight: "bold",
    fontSize:40
  },
  versesText: {
    marginRight: 10,
    fontWeight: "bold",
    fontSize:12,
    verticalAlign:"top"
  }
});
