import { Text, View } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function BlendScreen({ navigation }) {
  return (
    <View>
      <Header navigation={navigation} />
      <Text>This is Blend Page</Text>
      <Footer />
    </View>
  );
}
