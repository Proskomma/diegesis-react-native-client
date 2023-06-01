import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import HomeScreen from "./screens/HomeScreen";
import HowScreen from "./screens/HowScreren";
import WhoScreen from "./screens/WhoScreen";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import EntriesScreen from "./screens/EntriesScreen";
import { Button } from "react-native";
import { clearCache } from "react-native-clear-cache";

import React from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import SettingsScreen from "./screens/SettingsScreen";

export default function App() {
  const client = new ApolloClient({
    uri: "https://cjvh.proskomma.bible",
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
            <Drawer.Screen name="Settings" component={SettingsScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </ApolloProvider>
  );
}
