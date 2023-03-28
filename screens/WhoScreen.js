import { H3, H5, LI, UL } from "@expo/html-elements";
import { StyleSheet, Text, View } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function WhoScreen({ navigation }) {
  return (
    <View>
      <Header navigation={navigation} />
      <H3 style={styles.h3}>Who's behind Diegesis?</H3>
      <H5 style={styles.h3}>The Data</H5>
      <Text style={styles.h3}>Diegesis pulls data from a number of major open-access archives
        including:</Text>
      <UL style={styles.h3}>
        <LI>- The Digital Bible Library</LI>
        <LI>- Door 43</LI>
        <LI>- eBible</LI>
        <LI>- Vachan</LI>
      </UL>
      <H5 style={styles.h3}>The Software</H5>
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
    </View>
  );
}

const styles = StyleSheet.create({
  h3: {
    marginLeft: 10,
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
