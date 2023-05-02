import { Text } from "@react-native-material/core";
import { Linking, StyleSheet, View } from "react-native";

export default function Footer() {
  return (
    <View style={styles.ViewStyle}>
      <Text style={styles.textStyle}>
        <Text color="white">Diegesis.Bible is a project by </Text>
        <Text
          style={styles.clickableText}
          onPress={() => Linking.openURL("http://mvh.bible")}
        >
          MVH Solutions
        </Text>
        <Text color="white"> that uses the </Text>
        <Text
          style={styles.clickableText}
          onPress={() => Linking.openURL("http://doc.proskomma.bible")}
        >
          Proskomma Scripture Runtime Engine.
        </Text>
      </Text>
      <Text style={styles.styletitle}>© MVH Solutions 2023</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ViewStyle: {
    backgroundColor: "cornflowerblue",
    color: "#FFF",
    p: 3,
    borderRadius: 10,
  },
  textStyle: {
    margin: 10,
  },
  styletitle: {
    margin: 10,
    color: "white",
  },
  clickableText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
