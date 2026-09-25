import { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { supabase } from '../lib/supabase'

export type ImageItem = { url: string; name: string }

export function useImages() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from('images').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

      if (error) {
        Alert.alert('Error', error.message)
        return
      }

      if (data) {
        const items: ImageItem[] = data
          .filter((file) => file.name !== '.emptyFolderPlaceholder')
          .map((file) => ({
            name: file.name,
            url: supabase.storage.from('images').getPublicUrl(file.name).data.publicUrl,
          }))
        setImages(items)
      }
    } finally {
      setLoading(false)
    }
  }

  async function pickImage() {
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library.')
        return
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    })

    if (result.canceled || !result.assets || result.assets.length === 0) return

    const asset = result.assets[0]

    if (Platform.OS === 'web') {
      await uploadImageWeb(asset)
    } else {
      await uploadImage(asset.uri)
    }
  }

  async function uploadImageWeb(asset: ImagePicker.ImagePickerAsset) {
    setUploading(true)
    try {
      const response = await fetch(asset.uri)
      const blob = await response.blob()

      const mimeType = asset.mimeType || blob.type || 'image/jpeg'
      const extMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
      }
      const ext = extMap[mimeType] ?? 'jpg'
      const fileName = `${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, { contentType: mimeType, upsert: true })

      if (error) {
        Alert.alert('Upload failed', error.message)
      } else {
        setTimeout(() => fetchImages(), 500)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      Alert.alert('Error', message)
    } finally {
      setUploading(false)
    }
  }

  async function uploadImage(uri: string) {
    setUploading(true)
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })

      const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpg'
      const fileName = `${Date.now()}.${fileExt}`

      const mimeMap: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        gif: 'image/gif',
      }
      const contentType = mimeMap[fileExt] ?? 'image/jpeg'

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, decode(base64), { contentType, upsert: true })

      if (error) {
        Alert.alert('Upload failed', error.message)
      } else {
        setTimeout(() => fetchImages(), 500)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      Alert.alert('Error', message)
    } finally {
      setUploading(false)
    }
  }

  function confirmDelete(name: string) {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this image? This cannot be undone.')) {
        deleteImage(name)
      }
      return
    }
    Alert.alert('Delete image?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteImage(name) },
    ])
  }

  async function deleteImage(name: string) {
    const { error } = await supabase.storage.from('images').remove([name])
    if (error) {
      Alert.alert('Error', error.message)
      return
    }
    fetchImages()
  }

  return { images, uploading, loading, fetchImages, pickImage, confirmDelete }
}
