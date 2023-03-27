import { A, BR } from "@expo/html-elements";
import { StyleSheet, Text, View } from "react-native";

export default function Footer() {
  return (
    <View style={styles.ViewStyle}>
      <Text style={styles.textStyle}>
        <Text>Diegesis.Bible is a project by </Text>
        <A
          href="http://mvh.bible"
          target="_blank"
          rel="noreferrer"
          style={styles.linkStyles}
        >
          <Text>MVH Solutions </Text>
        </A>
        <Text>that uses the </Text>
        <A
          href="http://doc.proskomma.bible"
          target="_blank"
          rel="noreferrer"
          style={styles.linkStyles}
        >
          <Text>Proskomma Scripture Runtime Engine.</Text>
        </A>
      </Text>
      <Text style={styles.styletitle}>© MVH Solutions 2023</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  linkStyles: {
    color: "#FFF",
  },
  ViewStyle: {
    backgroundColor: "cornflowerblue",
    color: "#FFF",
    p: 3,
  },
  textStyle: {
    margin: 10,
  },
  styletitle: {
    margin : 10
  },
});
