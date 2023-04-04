import { StyleSheet } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

import { Surface, Text } from "@react-native-material/core";

export default function HowScreen({ navigation }) {
  return (
    <Surface>
      <Header navigation={navigation} />
      <Text variant="h5" style={styles.h3}>
        Diegesis Technology
      </Text>
      <Text style={styles.paragraph}>
        <Text>
          Diegesis is an open-source project. The source code is hosted on{" "}
        </Text>
        <Text
          style={styles.clickableText}
          onPress={() =>
            Linking.openURL("https://github.com/Proskomma/diegesis-monorepo")
          }
        >
          Github.
        </Text>
        <Text>Internally, Diegesis makes extensive use of the </Text>
        <Text
          style={styles.clickableText}
          onPress={() =>
            Linking.openURL("https://doc.proskomma.bible/en/latest/")
          }
        >
          Proskomma Scripture Runtime Engine
        </Text>
        <Text> to parse and process Scripture content.</Text>
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
