import InfoBox from "@/components/SharkComps/InfoBox";
import SharkHeader from "@/components/SharkComps/SharkHeader";
import {whaleSharkFacts} from "@/constants/SharkFacts";
import {router} from "expo-router";
import React from "react";
import {Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";

export default function WhaleScreen() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#27415F"}}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={() => router.replace("/(tabs)")}>
                        <Text style={styles.buttonText}>Back</Text>
                    </Pressable>
                </View>

                <SharkHeader image={require("./../../assets/images/whale-inner.jpg")} title="Whale Shark" />

                <View style={styles.section}>
                    <InfoBox title="Basic" items={whaleSharkFacts.basic} backgroundColor="#BBE0E0" />
                    <InfoBox title="Interesting" items={whaleSharkFacts.interesting} backgroundColor="#85E3E3" />
                    <InfoBox title="Insane!" items={whaleSharkFacts.insane} backgroundColor="#33D0D0" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
    },
    button: {
        alignSelf: "flex-start",
        marginVertical: 16,
        paddingVertical: 5,
        paddingHorizontal: 20,
        backgroundColor: "#1A6CBE",
        borderRadius: 20,
    },
    buttonText: {
        color: "#C8EAEA",
        fontWeight: "bold",
        fontSize: 25,
    },
    section: {
        width: "90%",
        maxWidth: 500,
        alignSelf: "center",
    },
});
