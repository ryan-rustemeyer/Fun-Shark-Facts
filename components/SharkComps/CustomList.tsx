import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  items: string[];
};

export default function CustomList({ items }: Props) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>{'\u2022'}</Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 10,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginBottom: 7,
  },
});