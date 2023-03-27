import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { NativeBaseProvider } from "native-base";
import ListComponent from "./components/ListComponent";

export default function App() {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });
  
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <ListComponent />
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
