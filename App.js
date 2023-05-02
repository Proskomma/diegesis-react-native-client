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
import { createDrawerNavigator } from "@react-navigation/drawer";
import EntriesScreen from "./screens/EntriesScreen";

export default function App() {
  const client = new ApolloClient({
    uri: "https://diegesis.bible/graphql",
    cache: new InMemoryCache(),
  });

  const Drawer = createDrawerNavigator();

  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Entries">
            <Drawer.Screen name="Entries" component={EntriesScreen} />
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="How" component={HowScreen} />
            <Drawer.Screen name="Who" component={WhoScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
