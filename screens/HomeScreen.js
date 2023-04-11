import { Surface, Text } from "@react-native-material/core";
import { Linking, StyleSheet } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function HomeScreen({ navigation }) {
  return (
    <Surface>
      <Header navigation={navigation} />
      <Text variant="h5" style={styles.h3}>
        Diegesis
      </Text>
      <Text variant="subtitle1" style={styles.h3}>
        Creative Commons Scripture Resources to Go!
      </Text>
      <Text style={styles.paragraph}>
        Diegesis is a place to find Bibles and related resources, in a variety
        of formats, released under open licences. (In other words, you can use,
        share, improve and translate them.)
      </Text>
      <Text style={styles.paragraph}>
        <Text>You can see the content </Text>
        <Text
          style={styles.clickableText}
          onPress={() => Linking.openURL("https://expo.dev")}
        >
          here
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
  styledButton: {
    width: "20%",
    alignSelf: "center",
  },
});
