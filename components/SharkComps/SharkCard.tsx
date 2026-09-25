import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SharkData, useBookmarks } from "./BookmarkContext";

//Loaded shark cards
type SharkCardProps = {
  shark: SharkData;
};

export default function SharkCard({ shark }: SharkCardProps) {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const isBookmarked = bookmarks.some((b) => b.title === shark.title);

  return (
    <View style={styles.card}>
      
      <Image source={shark.image} style={{width: "90%",
    height: 200,
    resizeMode: 'cover',
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 15,
    marginHorizontal: 20,}} />

      
      <View style={styles.subtitleRow}>
        <Pressable
          onPress={() =>
            router.push(shark.route as unknown as import("expo-router").RelativePathString)
          }
        >
          <Text style={styles.subtitle}>{shark.title}</Text>
        </Pressable>

        <Pressable onPress={() => toggleBookmark(shark)}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={28}
            color={isBookmarked ? "#FFD700" : "white"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "85%",
    maxWidth: 500,
    backgroundColor: "#00689E",
    alignSelf: "center",
    marginVertical: 20,
    borderRadius: 30,
    overflow: "hidden",
  },
  
  subtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    padding: 10,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginRight: 25,

  },
});