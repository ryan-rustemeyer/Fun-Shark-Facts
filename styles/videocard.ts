import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 2,
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  more: {
    fontSize: 18,
    paddingHorizontal: 6,
    opacity: 0.6,
  },
})
