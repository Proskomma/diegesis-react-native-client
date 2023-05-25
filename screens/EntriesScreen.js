import { createStackNavigator } from "@react-navigation/stack";
import DetailsScreen from "./DetailsScreen";
import ReadingScreen from "./ReadingScreen";
import ListScreen from "./ListScreen";
import TestScreen from "./TestScreen";

export default function EntriesScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Entries">
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Reading" component={ReadingScreen} />
      <Stack.Screen name="Testing" component={TestScreen} />
    </Stack.Navigator>
  );
}
