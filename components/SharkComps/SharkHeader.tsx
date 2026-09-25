import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

type Props = {
  image: ImageSourcePropType;
  title: string;
};

export default function SharkHeader({ image, title }: Props) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: '#0C2644',
    marginTop: 10,
    paddingBottom: 20,
    borderRadius:10,
    
    
  },
  image: {
    width: '100%',
    height: 220,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    resizeMode: 'cover',
    
    
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#7CC2C2',
    textAlign: 'center',
    marginTop: 12,
  },
});