import {router} from "expo-router";
import React from "react";
import {Image, Pressable, StyleSheet, Text, View} from "react-native";

//Customized shark cards
type Props = {
    shark: {
        id: string;
        shark_name: string;
        shark_url: string | null;
        basic_facts: string;
        interesting_facts: string;
        insane_facts: string;
    };

    onEdit?: () => void;
    onDelete?: () => void;
};

export default function SupabaseSharkCard({shark, onEdit, onDelete}: Props) {
    return (
        <View style={styles.card}>
            {shark.shark_url && <Image source={{uri: shark.shark_url}} style={styles.image} resizeMode="cover" />}

            <Pressable
                onPress={() =>
                    router.replace({
                        pathname: "/user-shark-details",
                        params: {id: shark.id},
                    })
                }
            >
                <View style={styles.content}>
                    <Text style={styles.title}>{shark.shark_name}</Text>
                </View>
            </Pressable>

            {/* ACTION BUTTONS */}
            <View style={styles.actions}>
                <Pressable onPress={onEdit} style={styles.iconBtn}>
                    <Text style={styles.editText}>Edit</Text>
                </Pressable>

                <Pressable onPress={onDelete} style={styles.iconBtn}>
                    <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "85%",
        backgroundColor: "#00689E",
        borderRadius: 30,
        alignSelf: "center",
        marginVertical: 20,
        overflow: "hidden",
    },
    image: {
        width: "90%",
        height: 200,

        borderRadius: 30,
        alignSelf: "center",
        marginTop: 15,
        marginHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        padding: 10,
        alignSelf: "center",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 8,
        paddingHorizontal: 8,
    },

    iconBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        gap: 5,
        borderRadius: 15,
        padding: 8,
        marginHorizontal: 10,
        marginBottom: 5,
    },

    editText: {
        color: "#1060B0",
        fontWeight: "600",
    },

    deleteText: {
        color: "#c11e34",
        fontWeight: "600",
    },
    content: {
        padding: 10,
    },
});
