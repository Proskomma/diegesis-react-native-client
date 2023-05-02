import { Linking, StyleSheet } from "react-native";
import Footer from "../components/Footer";
import { ListItem, Surface, Text } from "@react-native-material/core";

export default function WhoScreen() {
  return (
    <Surface>
      <Text variant="h5" style={styles.h3}>
        Who's behind Diegesis?
      </Text>
      <Text variant="subtitle1" style={styles.h3}>
        The Data
      </Text>
      <Text style={styles.paragraph}>
        Diegesis pulls data from a number of major open-access archives
        including:
      </Text>
      <Surface style={styles.paragraph}>
        <ListItem title="The Digital Bible Library"></ListItem>
        <ListItem title="Door 43"></ListItem>
        <ListItem title="eBible"></ListItem>
        <ListItem title="Vachan"></ListItem>
      </Surface>

      <Text variant="subtitle1" style={styles.h3}>
        The Software
      </Text>
      <Text style={styles.paragraph}>
        <Text>The Diegesis project is led by Mark Howe from </Text>
        <Text
          style={styles.clickableText}
          onPress={() => Linking.openURL("https://mvh.bible/")}
        >
          MVH Solutions.
        </Text>
      </Text>
      <Footer />
    </Surface>
  );
}

const styles = StyleSheet.create({
  h3: {
    marginLeft: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paragraph: {
    marginLeft: 10,
    marginBottom: 10,
  },
  clickableText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
