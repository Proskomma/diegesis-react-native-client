import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { InMemoryCache, ApolloClient } from "@apollo/client";

const TestComponent = () => {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });

  const memoClient = useMemo(() => client);
  const [orgs, setOrgs] = useState([]);
   // runs once, when the page is rendered
   useEffect(() => {
          const doOrgs = async () => {
            const result = await memoClient.query({
              query: gql`
                {
                  orgs {
                    id: name
                  }
                }
              `,
            });
            setOrgs(result.data.orgs.map((o) => o.id));
          };
          doOrgs();
        }, []);
      
  return <View>
          {orgs.map(o=>{
                    <Text>{o}</Text>
          })}
  </View>;
};

export default TestComponent;
