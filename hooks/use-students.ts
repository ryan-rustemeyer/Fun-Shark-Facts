import { useEffect, useState } from 'react'
import { Alert, Platform } from 'react-native'
import { supabase } from '../lib/supabase'

type Student = {
  id: number
  name: string
  age: number
  major: string
}

const nameRegex = /^[a-zA-Z\s]+$/

function validate(name: string, age: string, major: string): string | null {
  if (!name.trim() || name.trim().length < 2)
    return 'Name must be at least 2 characters.'
  if (!nameRegex.test(name.trim()))
    return 'Name can only contain letters and spaces.'
  const ageNum = Number(age)
  if (!age.trim() || isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum < 5 || ageNum > 120)
    return 'Age must be a whole number between 5 and 120.'
  if (!major.trim() || major.trim().length < 2)
    return 'Major must be at least 2 characters.'
  return null
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [major, setMajor] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  async function fetchStudents() {
    const { data: userData } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userData.user?.id)

    if (error) {
      Alert.alert('Error', error.message)
      return
    }

    setStudents(data || [])
  }

  async function saveStudent() {
    const validationError = validate(name, age, major)
    if (validationError) {
      Alert.alert('Invalid input', validationError)
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('students')
        .update({ name: name.trim(), age: Number(age), major: major.trim() })
        .eq('id', editingId)

      if (error) {
        Alert.alert('Error', error.message)
        return
      }
    } else {
      const { data: userData } = await supabase.auth.getUser()
      const { error } = await supabase.from('students').insert({
        user_id: userData.user?.id,
        name: name.trim(),
        age: Number(age),
        major: major.trim(),
      })

      if (error) {
        Alert.alert('Error', error.message)
        return
      }
    }

    resetForm()
    fetchStudents()
  }

  function editStudent(student: Student) {
    setName(student.name)
    setAge(String(student.age))
    setMajor(student.major)
    setEditingId(student.id)
  }

  function resetForm() {
    setName('')
    setAge('')
    setMajor('')
    setEditingId(null)
  }

  function confirmDelete(id: number) {
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this student? This cannot be undone.')) {
        deleteStudent(id)
      }
      return
    }
    Alert.alert('Delete student?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteStudent(id) },
    ])
  }

  async function deleteStudent(id: number) {
    const { error } = await supabase.from('students').delete().eq('id', id)
    if (error) {
      Alert.alert('Error', error.message)
      return
    }
    if (editingId === id) resetForm()
    fetchStudents()
  }

  return {
    students,
    name, setName,
    age, setAge,
    major, setMajor,
    editingId,
    saveStudent,
    editStudent,
    confirmDelete,
    resetForm,
  }
}
