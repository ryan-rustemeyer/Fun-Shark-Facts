import {useState} from "react";
import {StyleSheet, TextInput} from "react-native";

//Make sure text box grows with text
export default function AutoGrowingInput({
    value,
    onChangeText,
    placeholder,
    style,
}: {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    style?: any;
}) {
    const [height, setHeight] = useState(40);

    return (
        <TextInput
            value={value}
            multiline
            placeholder={placeholder}
            textAlignVertical="top"
            style={[styles.input, style, {minHeight: 40, height}]}
            onChangeText={(text) => {
                onChangeText(text);
            }}
            onContentSizeChange={(e) => {
                const newHeight = e.nativeEvent.contentSize.height;
                if (newHeight !== height) {
                    setHeight(newHeight);
                }
            }}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
});
