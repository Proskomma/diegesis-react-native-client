import { StyleSheet, Text, View } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function HowScreen({navigation}) {
  return (
    <View>
      <Header navigation={navigation}/>
      <Text style={styles.header}> This is how Screen</Text>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    flex: 1,
  },
});
