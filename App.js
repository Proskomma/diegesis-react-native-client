import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider } from "native-base";
import DetailsScreen from "./screens/DetailsScreen";
import HomeScreen from "./screens/HomeScreen";
import HowScreen from "./screens/HowScreren";
import ListScreen from "./screens/ListScreen";
import ReadingScreen from "./screens/ReadingScreen";
import WhoScreen from "./screens/WhoScreen";

export default function App() {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });
  const Stack = createStackNavigator();
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="How" component={HowScreen} />
            <Stack.Screen name="Who" component={WhoScreen} />
            <Stack.Screen name="List" component={ListScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="Reading" component={ReadingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
