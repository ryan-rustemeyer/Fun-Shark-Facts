import { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { supabase } from '../lib/supabase'

type Note = {
  id: number
  content: string
  created_at: string
}

export function useNotes() {
  const [text, setText] = useState('')
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      Alert.alert('Error', error.message)
      return
    }

    setNotes(data || [])
  }

  async function addNote() {
    const trimmed = text.trim()

    if (trimmed.length === 0) {
      Alert.alert('Empty note', 'Please write something before saving.')
      return
    }

    if (trimmed.length < 3) {
      Alert.alert('Too short', 'Note must be at least 3 characters.')
      return
    }

    setLoading(true)

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      setLoading(false)
      return
    }

    const { error } = await supabase.from('notes').insert({
      user_id: userData.user.id,
      content: trimmed,
    })

    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
      return
    }

    setText('')
    fetchNotes()
  }

  function confirmDelete(id: number) {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this note? This cannot be undone.')) {
        deleteNote(id)
      }
      return
    }
    Alert.alert('Delete note?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(id) },
    ])
  }

  async function deleteNote(id: number) {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) {
      Alert.alert('Error', error.message)
      return
    }
    fetchNotes()
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return { text, setText, notes, loading, addNote, confirmDelete, logout }
}
