import { StyleSheet } from "react-native";
import Footer from "../components/Footer";
import { Surface } from "@react-native-material/core";
import { Button, Icon } from "native-base";
import React from "react";
import { Alert } from "react-native";
import { CacheManager } from "react-native-expo-image-cache";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const clearCache = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      Alert.alert("Your cache has been cleared successfully");
    } catch (error) {
      Alert.alert("Error clearing cache:", error);
    }
  };

  return (
    <Surface>
      <Button
        style={{
          width: "60%",
          alignSelf: "center",
          marginBottom: "20%",
          marginTop: "20%",
        }}
        leftIcon={
          <Icon as={Ionicons} name="settings-outline" size="sm" color="black" />
        }
        onPress={() => clearCache()}
      >
        Clear cache
      </Button>
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
