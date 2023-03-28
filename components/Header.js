import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function Header({navigation}) {
  return (
    <View style={styles.header}>
      <AntDesign name="home" size={24} color="black" onPress={()=>navigation.navigate('Home')}/>
      <Ionicons name="people" size={24} color="black" onPress={()=>navigation.navigate('Who')}/>
      <MaterialIcons name="how-to-reg" size={24} color="black" onPress={()=>navigation.navigate('How')}/>
      <Entypo name="list" size={24} color="black" onPress={()=>navigation.navigate('List')}/>
      <MaterialCommunityIcons name="blender" size={24} color="black" onPress={()=>navigation.navigate('Blend')}/>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    position: "sticky",
    top: 0,
    zIndex: 10,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: "cornflowerblue",
  },
});
