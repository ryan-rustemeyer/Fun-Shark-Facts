import InfoBox from "@/components/SharkComps/InfoBox";
import SharkHeader from "@/components/SharkComps/SharkHeader";
import {supabase} from "@/lib/supabase";
import {router, useLocalSearchParams} from "expo-router";
import React, {useEffect, useState} from "react";
import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";

type Shark = {
    id: string;
    shark_name: string;
    shark_url: string | null;
    basic_facts: string;
    interesting_facts: string;
    insane_facts: string;
};

export default function SharkDetails() {
    const {id} = useLocalSearchParams();

    const [shark, setShark] = useState<Shark | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchShark() {
            const cleanId = Array.isArray(id) ? id[0] : id;

            console.log("FETCHING ID:", cleanId);

            const {data, error} = await supabase.from("shark_info").select("*").eq("id", cleanId).single();

            if (error) {
                console.log(error);
                setShark(null);
            } else {
                setShark(data);
            }

            setLoading(false);
        }

        if (id) fetchShark();
    }, [id]);

    // Loading state
    if (loading) {
        return <Text>Loading shark...</Text>;
    }

    // Empty state
    if (!shark) {
        return <Text>No shark found</Text>;
    }

    // Safely split the facts into arrays
    const basicFactsArray =
        shark.basic_facts
        ?.split(/\n|;/)
        .map((f) => f.trim())
        .filter((f) => f.length > 0) ?? [];
    const interestingFactsArray =
        shark.interesting_facts
        ?.split(/\n|;/)
        .map((f) => f.trim())
        .filter((f) => f.length > 0) ?? [];
    const insaneFactsArray =
        shark.insane_facts
        ?.split(/\n|;/)
        .map((f) => f.trim())
        .filter((f) => f.length > 0) ?? [];

    return (
        <ScrollView style={{backgroundColor: "#27415F"}}>
            <View style={styles.contentContainer}>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.button} onPress={() => router.replace("/(tabs)/template")}>
                        <Text style={styles.buttonText}>Back</Text>
                    </Pressable>
                </View>

                {shark.shark_url && <SharkHeader image={{uri: shark.shark_url} as any} title={shark.shark_name} />}

                <InfoBox title="Basic Facts" items={basicFactsArray} backgroundColor="#BBE0E0" />
                <InfoBox title="Interesting Facts" items={interestingFactsArray} backgroundColor="#85E3E3" />
                <InfoBox title="Insane Facts" items={insaneFactsArray} backgroundColor="#33D0D0" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
    },
    contentContainer: {
        width: "100%",
        alignSelf: "center",
        paddingBottom: 20,
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
});
