import {router} from "expo-router";
import React from "react";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {useBookmarks} from "../../components/SharkComps/BookmarkContext";
import SharkCard from "../../components/SharkComps/SharkCard";

export default function BookmarksScreen() {
    const {bookmarks} = useBookmarks(); // Only the bookmarked sharks

    return (
        <ScrollView style={{flex: 1, backgroundColor: "#2A717B"}} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Bookmarks</Text>

                {/* Only render sharks that are in bookmarks */}
                {bookmarks.length === 0 ? (
                    <Text style={styles.noBookmarksText}>You haven’t bookmarked any sharks yet.</Text>
                ) : (
                    bookmarks.map((shark, index) => <SharkCard key={index} shark={shark} />)
                )}

                <Pressable style={styles.Button} onPress={() => router.replace("/(tabs)")}>
                    <Text style={styles.ButtonText}>Home</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "85%",
        maxWidth: 500,
        alignSelf: "center",
        borderRadius: 30,
        margin: 35,
        paddingBottom: 30,
        paddingTop: 15,
        backgroundColor: "#C1D8DF",
    },
    Button: {
        alignSelf: "center",
        paddingVertical: 8,
        paddingHorizontal: 20,
        justifyContent: "center",
        backgroundColor: "#21575f",
        borderRadius: 30,
        marginTop: 40,
    },
    ButtonText: {
        color: "#C8EAEA",
        fontWeight: "bold",
        fontSize: 25,
    },
    title: {
        fontSize: 40,
        fontWeight: "300",
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 20,
        fontFamily: "serif",
    },
    noBookmarksText: {
        alignSelf: "center",
        fontSize: 18,
        color: "#333",
        marginTop: 25,
    },
});
