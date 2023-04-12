import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { VStack } from "@react-native-material/core";
import { StyleSheet } from "react-native";

export default function Header({ navigation }) {
  return (
    <VStack style={styles.header}>
      <Entypo
        name="list"
        size={24}
        color="white"
        onPress={() => navigation.navigate("List")}
      />
      <AntDesign
        name="home"
        size={24}
        color="white"
        onPress={() => navigation.navigate("Home")}
      />
      <Ionicons
        name="people"
        size={24}
        color="white"
        onPress={() => navigation.navigate("Who")}
      />
      <MaterialIcons
        name="how-to-reg"
        size={24}
        color="white"
        onPress={() => navigation.navigate("How")}
      />
    </VStack>
  );
}
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: "cornflowerblue",
  },
});
