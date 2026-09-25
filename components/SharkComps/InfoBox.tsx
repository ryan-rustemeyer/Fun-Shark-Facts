import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomList from "./CustomList";

type Props = {
  title: string;
  items: string[];
  backgroundColor: string;
};

export default function InfoBox({ title, items, backgroundColor }: Props) {
  return (
    <View>
      <Text style={styles.subtitle}>{title}</Text>

      <View style={[styles.box, { backgroundColor }]}>
        <CustomList items={items} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 28,
    color: 'white',
    fontWeight: '500',
    marginTop: 20,
    marginLeft: 20,
  },
  box: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    borderRadius: 25,
    padding: 20,
    marginTop: 10,
    marginBottom: 15,
  },
});