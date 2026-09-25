import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SharkData } from "../../components/SharkComps/BookmarkContext";
import SharkCard from "../../components/SharkComps/SharkCard";
import { nurseSharkFacts, thresherSharkFacts, whaleSharkFacts } from "../../constants/SharkFacts";

const sharks: SharkData[] = [
  {
    title: "Whale Shark",
    image: require("./../../assets/images/whale_outer.jpg"),
    route: "/whale",
    basicFacts: whaleSharkFacts.basic,
    interestingFacts: whaleSharkFacts.interesting,
    intenseFacts: whaleSharkFacts.insane,
  },
  {
    title: "Thresher Shark",
    image: require("./../../assets/images/thresher_outer.jpg"),
    route: "/thresher",
    basicFacts: thresherSharkFacts.basic,
    interestingFacts: thresherSharkFacts.interesting,
    intenseFacts: thresherSharkFacts.insane,
  },
  {
    title: "Nurse Shark",
    image: require("./../../assets/images/nurse_outer.png"),
    route: "/nurse",
    basicFacts: nurseSharkFacts.basic,
    interestingFacts: nurseSharkFacts.interesting,
    intenseFacts: nurseSharkFacts.insane,
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#2A717B" }} showsVerticalScrollIndicator={false}>
      <View style={styles.container}> 

        <View style={styles.headerRow}>
        

        <Pressable style={styles.AccountButton} onPress={() => router.push("/(tabs)/account")}>
          <Image source = {require('../../assets/images/account_logo3.png')} style = {{height: 50,
    width: 50,
    borderRadius: 50,
    resizeMode: 'cover',}}></Image>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push("/(tabs)/template")}>
          <Text style={styles.buttonText}>Add shark</Text>
        </Pressable>

        

        <Pressable onPress={() => router.push("/(tabs)/bookmarks")}>
  <View style={{ width: 34, height: 34, justifyContent: "center", alignItems: "center" }}>
   
    <Ionicons
      name="bookmark"
      size={46}              
      color="#000000"        
      style={{ position: "absolute", paddingTop: 1, }}
    />
    
    <Ionicons
      name="bookmark"
      size={40}             
      color="#FFD700" style = {{marginBottom: 1,}}  
    />
  </View>
</Pressable>
      </View>

<Text style={styles.title}>Home</Text>

        {/* Shark Cards */}
        {sharks.map((shark, index) => (
          <SharkCard key={index} shark={shark} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  headerRow: {
    flexDirection: "row",          // horizontal row
    justifyContent: "space-between", // push Home left, bookmark right
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  container: {
    width: "85%",
    maxWidth: 500,
    backgroundColor: "#C1D8DF",
    alignSelf: "center",
    borderRadius: 30,
    margin: 35,
    paddingBottom: 30,
    paddingTop: 20,
  },
  button: {
    
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#1060B0",
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 18,
    alignSelf: "center",
    color: "#C8EAEA",
  },
  title: {
    fontSize: 50,
    fontWeight: "300",
    alignSelf: "center",
    marginTop: 10,
    fontFamily: "serif",
  },
  bookmarkButton: {
    borderWidth: 2,           // outline thickness
    borderColor: "#B8860B",   // dark yellow border
    borderRadius: 8,
    padding: 4,
  },

  
  AccountButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  }
  
});