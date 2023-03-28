import { H3, H5} from "@expo/html-elements";
import { Linking, StyleSheet, Text, View } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Header navigation={navigation} />
      <H3 style={styles.h3}>Diegesis</H3>
      <H5 style={styles.h3}>Creative Commons Scripture Resources to Go!</H5>
      <Text style={styles.h3}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  h3: {
    marginLeft: 10,
  },
  paragraph:{
    marginLeft: 10,
    marginBottom : 10
  },
  clickableText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
