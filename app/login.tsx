import {router} from "expo-router";
import {useState} from "react";
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {supabase} from "../lib/supabase";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Missing fields", "Enter your email and password.");
            return;
        }

        setLoading(true);

        const {error} = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        setLoading(false);

        if (error) {
            Alert.alert("Login failed", error.message);
            return;
        }

        router.replace("/(tabs)");
    }

    return (
        <ImageBackground source={require("../assets/images/shark-pattern.jpg")} resizeMode="cover" style={styles.image}>
            <SafeAreaView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>✨Fun Shark Facts✨</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>LOG IN</Text>}
                    </Pressable>

                    <Pressable onPress={() => router.push("/register")}>
                        <Text style={styles.link}>Need an account? Sign up</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignSelf: "center",
        padding: 24,
    },
    image: {
        flex: 1,
        height: "100%",
        width: "100%",
    },

    card: {
        gap: 14,
        backgroundColor: "#C1D8DF",
        borderColor: "#3A7C85",
        borderWidth: 30,
        width: "100%",
        maxWidth: 500,
        alignSelf: "center",
        borderRadius: 50,
        padding: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: "500",
        marginBottom: 10,
        marginTop: 50,
        alignSelf: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#d0d0d0",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        alignSelf: "center",
        width: "90%",
        backgroundColor: "white",
    },
    button: {
        backgroundColor: "#2A717B",
        borderRadius: 20,
        paddingVertical: 8,
        alignSelf: "center",
        marginTop: 8,
        width: 200,
        height: 50,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 25,
        alignSelf: "center",
        paddingBottom: 2,
    },
    link: {
        marginTop: 8,
        marginBottom: 15,
        textAlign: "center",
        color: "#1f6069",
        textDecorationLine: "underline",
        fontSize: 15,
    },
});
