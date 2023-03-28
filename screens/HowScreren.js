import { H3 } from "@expo/html-elements";
import { StyleSheet, Text, View } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function HowScreen({navigation}) {
  return (
    <View>
      <Header navigation={navigation}/>
      <H3 style={styles.h3}>Diegesis Technology</H3>
      <Text style={styles.h3}>
        <Text>Diegesis is an open-source project. The source code is hosted on </Text>
        <Text style={styles.clickableText}
          onPress={() => Linking.openURL("https://github.com/Proskomma/diegesis-monorepo")}>Github.
        </Text>
        <Text>Internally, Diegesis makes extensive use of the </Text>
        <Text style={styles.clickableText}
          onPress={() => Linking.openURL("https://doc.proskomma.bible/en/latest/")}>Proskomma Scripture Runtime Engine
        </Text>
        <Text> to parse and process Scripture content.</Text>
      </Text>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  h3: {
    marginLeft: 10,
    marginBottom : 10 
  },
  clickableText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
