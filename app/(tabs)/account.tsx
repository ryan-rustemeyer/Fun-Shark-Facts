import {supabase} from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";

export default function AccountScreen() {
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);

    useEffect(() => {
        loadUserAndProfile();
    }, []);

    async function loadUserAndProfile() {
        // 1. Get logged-in user
        const {
            data: {user},
            error,
        } = await supabase.auth.getUser();

        if (error || !user) {
            console.log("No user");
            setLoading(false);
            return;
        }

        setUser(user);

        // 2. Get profile (name + profile image)
        const {data: profile} = await supabase.from("profile").select("name, avatar_url").eq("id", user.id).single();

        if (profile) {
            setName(profile.name || "");
            if (profile.avatar_url) {
                downloadImage(profile.avatar_url);
            }
        }

        setLoading(false);
    }

    async function downloadImage(path: string) {
        try {
            const {data, error} = await supabase.storage.from("profile_pic").download(path);

            if (error) throw error;

            const url = URL.createObjectURL(data);
            setProfileUrl(url);
        } catch (error) {
            console.log("Error downloading image:", error);
        }
    }

    // 3. Save name (insert or update)
    async function saveName() {
        if (!user) return;

        const {error} = await supabase.from("profile").upsert({
            id: user.id,
            name: name,
            avatar_url: `${user.id}.png`,
        });

        if (error) {
            console.log(error);
        } else {
            alert("Name saved!");
        }
    }

    // 4. Pick an image and upload
    async function uploadProfileImage() {
        if (!user) return;

        // Request permissions
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        // Pick image
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // square crop
            quality: 1,
        });

        if (pickerResult.canceled) return;

        const uri = pickerResult.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();

        // Upload to Supabase Storage
        const {data, error} = await supabase.storage.from("profile_pic").upload(`profile_pic/${user.id}.png`, blob, {
            upsert: true,
        });

        if (error) {
            console.log("Upload error:", error);
        } else {
            setProfileUrl(uri); // Update local preview
        }
    }

    if (loading) return <ActivityIndicator style={{marginTop: 50}} />;

    return (
        <View style={{flex: 1}}>
            <View style={{backgroundColor: "#2A717B", flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.imageRow}>
                        <Image
                            source={profileUrl ? {uri: profileUrl} : require("./../../assets/images/account-logo3.png")}
                            style={styles.avatar}
                        />

                        {/* Upload Button below the image */}
                        <Pressable onPress={uploadProfileImage} style={{marginTop: 5}}>
                            <Text
                                style={{
                                    color: "#041c29",
                                    fontWeight: "bold",
                                    textDecorationLine: "underline",
                                    fontSize: 14,
                                    alignSelf: "center",
                                }}
                            >
                                Upload
                            </Text>
                        </Pressable>
                    </View>

                    {/* Name input */}
                    <View style={{width: "90%", alignSelf: "center"}}>
                        <Text style={{marginTop: 25, marginBottom: 5, alignSelf: "flex-start", fontSize: 16}}>
                            Name:
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            style={{
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 8,
                                width: "100%",
                            }}
                        />
                    </View>

                    <View style={{width: "90%", alignSelf: "center"}}>
                        <Text style={{marginBottom: 5, marginTop: 20, alignSelf: "flex-start", fontSize: 16}}>
                            Email:
                        </Text>

                        <TextInput
                            value={user?.email}
                            editable={false}
                            style={{
                                borderWidth: 1,
                                padding: 10,
                                borderRadius: 8,
                                marginBottom: 10,
                                width: "100%",
                            }}
                        />
                    </View>

                    <View style={{alignItems: "center"}}>
                        <Pressable onPress={saveName} style={[styles.button, {marginTop: 20}]}>
                            <Text style={styles.buttonText}>Save Name</Text>
                        </Pressable>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                        <Pressable style={styles.button} onPress={() => router.replace("/(tabs)")}>
                            <Text style={styles.buttonText}>Home</Text>
                        </Pressable>

                        <Pressable style={styles.button} onPress={() => router.replace("/login")}>
                            <Text style={styles.buttonText}>Log out</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        maxWidth: 500,
        flex: 1,
        padding: 10,
        margin: 25,
        backgroundColor: "#C1D8DF",
        borderColor: "#53B3C1",
        borderWidth: 25,
        borderRadius: 45,
        alignSelf: "center",
    },
    imageRow: {
        alignSelf: "center",
        alignItems: "center",
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        marginHorizontal: 5,
        marginVertical: 8,
        marginBottom: 15,
        backgroundColor: "#1060B0",
        borderRadius: 15,
    },
    buttonText: {
        fontSize: 15,
        alignSelf: "center",
        color: "white",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 15,
        marginBottom: 6,
        resizeMode: "cover",
    },
});
