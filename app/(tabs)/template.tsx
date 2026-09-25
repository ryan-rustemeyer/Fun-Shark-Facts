
import AutoGrowingInput from "@/components/SharkComps/AutoGrowInput";
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import SupabaseSharkCard from "../../components/SharkComps/SupabaseSharkCard";

import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';



type Row = {
  id: string;          // ← keep — primary key
  shark_name: string;   // ← CHANGE — replace with your column name
  basic_facts: string;         // ← CHANGE — replace with your column name
  interesting_facts: string;        // ← CHANGE — replace with your column name
  insane_facts: string; 
  shark_url: string | null;       // ← CHANGE — replace with your column name

};


const EMPTY_FORM = {
  shark_name: '',   // ← CHANGE
  basic_facts: '',         // ← CHANGE
  interesting_facts: '',        // ← CHANGE
  insane_facts: '', 
  image: null, 
};

const TABLE = 'shark_info'; 
const SORT_BY = 'shark_name'; 


type FormValues = {
  shark_name: string;
  basic_facts: string;
  interesting_facts: string;
  insane_facts: string;
  image: string | null; // ✅ FIXED
};;

export default function CrudScreen() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);

  
  async function fetchRows() {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order(SORT_BY, { ascending: true });

    if (error) Alert.alert('Error loading data', error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchRows(); }, []);

  
  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    
    const editable = Object.fromEntries(
      Object.keys(EMPTY_FORM).map((k) => [k, (row as any)[k] ?? null])
    ) as FormValues;
    setForm(editable);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  const uploadImage = async (uri: string): Promise<string | null> => {
  const fileName = `shark-${Date.now()}.jpg`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from('shark_images') 
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
    });

  if (error) {
    console.error(error);
    return null;
  }

  const { data } = supabase.storage
    .from('shark_images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

  async function saveRow() {
  setSaving(true);

  let imageUrl = editing?.shark_url || null;

  
  if (form.image && form.image !== editing?.shark_url) {
    imageUrl = await uploadImage(form.image);
  }

  const payload = {
    shark_name: form.shark_name,
    basic_facts: form.basic_facts,
    interesting_facts: form.interesting_facts,
    insane_facts: form.insane_facts,
    shark_url: imageUrl,
  };

  if (editing) {
    const { error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', editing.id);

    if (error) Alert.alert('Error updating', error.message);
    else {
      closeModal();
      fetchRows();
    }
  } else {
    const { error } = await supabase
      .from(TABLE)
      .insert(payload);

    if (error) Alert.alert('Error adding', error.message);
    else {
      closeModal();
      fetchRows();
    }
  }

  setSaving(false);
}

function confirmDelete(row: Row) {
  setDeleteTarget(row);
  setShowDeleteModal(true);
}

 async function deleteRow(id: string) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    Alert.alert('Error deleting', error.message);
    return;
  }

  await fetchRows();
  setShowDeleteModal(false);
  setDeleteTarget(null);
}   


  return (
  <>
  <ScrollView style = {{flex: 1, backgroundColor: '#2A717B'}}showsVerticalScrollIndicator={false}>
    <View style={styles.container}>
      <View style = {styles.header}>

        <Pressable style={styles.button} onPress={() => router.push("/(tabs)")}>
        <Text style={styles.buttonText}>Home</Text>
      </Pressable>

      <Pressable style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </Pressable>
      </View>
      
        <Text style={styles.title}>Additional Sharks</Text>
        
      <FlatList<Row>
            data={rows}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SupabaseSharkCard
                shark={item}
                onEdit={() => openEdit(item)}
                onDelete={() => confirmDelete(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No rows yet. Tap + Add to create one.
              </Text>
            }
          />
          
      </View>

      {/* CONTENT */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : (
        <>
          

          {/* ADD / EDIT MODAL */}
          <Modal visible={modalVisible} animationType="slide" transparent>
            <ScrollView style = {{flex: 1}}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>

                <Text style={styles.modalTitle}>
                  {editing ? 'Edit Shark' : 'New Shark'}
                </Text>

                <Text style={styles.label}>Name</Text>
                <AutoGrowingInput
                  value={form.shark_name}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, shark_name: v }))
                  }
                />

                <Text style={styles.label}>Shark Image</Text>

                <Pressable
                  style={styles.input}
                  onPress={async () => {
                    const result =
                      await ImagePicker.launchImageLibraryAsync({
                        mediaTypes:
                          ImagePicker.MediaTypeOptions.Images,
                        quality: 0.7,
                      });

                    if (!result.canceled && result.assets?.length) {
                      setForm((f) => ({
                        ...f,
                        image: result.assets[0].uri,
                      }));
                    }
                  }}
                >
                  <Text>
                    {form.image ? 'Change Image' : 'Upload Image'}
                  </Text>
                </Pressable>

                {/* IMAGE PREVIEW */}
                {form.image && (
                  <Image
                    source={{ uri: form.image }}
                    style={{
                      width: '100%',
                      height: 180,
                      borderRadius: 10,
                      marginBottom: 12,
                    }}
                    resizeMode="cover"
                  />
                )}

                <Text style={styles.label}>Basic</Text>
                <AutoGrowingInput
                  value={form.basic_facts}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, basic_facts: v }))
                  }
                />

                <Text style={styles.label}>Interesting</Text>
                <AutoGrowingInput
                  value={form.interesting_facts}
                  onChangeText={(v) =>
                    setForm((f) => ({
                      ...f,
                      interesting_facts: v,
                    }))
                  }
                />

                <Text style={styles.label}>Insane</Text>
                <AutoGrowingInput
                  value={form.insane_facts}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, insane_facts: v }))
                  }
                />

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={closeModal}
                    disabled={saving}
                  >
                    <Text style={styles.cancelBtnText}>
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.saveBtn}
                    onPress={saveRow}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.saveBtnText}>
                        {editing ? 'Update' : 'Add'}
                      </Text>
                    )}
                  </Pressable>
                </View>

              </View>
            </View></ScrollView>
          </Modal>

          {/* DELETE MODAL */}
          <Modal transparent visible={showDeleteModal} animationType="fade">
            <View style={styles.overlay}>
              <View style={styles.popup}>

                <Text style={styles.popupTitle}>
                  Delete this item?
                </Text>

                <Text style={styles.popupText}>
                  This action cannot be undone.
                </Text>

                <View style={styles.popupActions}>
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => setShowDeleteModal(false)}
                  >
                    <Text>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={styles.confirmBtn}
                    onPress={() =>
                      deleteTarget &&
                      deleteRow(deleteTarget.id)
                    }
                  >
                    <Text style={{ color: 'white' }}>
                      Delete
                    </Text>
                  </Pressable>
                </View>

              </View>
            </View>
          </Modal>
        </>
      )}

      {/* HOME BUTTON */}
      

    </ScrollView>
  </>
);
}

const styles = StyleSheet.create({
  container: { 
    width: '85%', maxWidth: 500, 
    backgroundColor: "#C1D8DF", 
    borderRadius: 30, 
    margin: 35,
    paddingBottom: 30,
    paddingTop: 20,
    alignSelf: 'center',

  },
  header: {
    flexDirection: "row",          
    justifyContent: "space-between", 
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  title: {
    fontSize: 35,
    fontWeight: "400",
    alignSelf: "center",
    marginTop: 10,
    fontFamily: "serif",
   },

  addBtn: { 
    backgroundColor: '#224b74', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 30,
    
    alignSelf: 'flex-end',
  },

  addBtnText: { color: '#C8EAEA', fontWeight: '600', fontSize: 15 },

  list: { padding: 12, gap: 10 },
  empty: { textAlign: 'center', marginTop: 60, color: '#999', fontSize: 15 },
  card: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 3, elevation: 2,
  },
  cardInfo: { flex: 1 },
  cardId: { fontSize: 13, color: '#888', marginBottom: 2 },
  cardName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  cardSub: { fontSize: 13, color: '#555' },
  cardActions: { gap: 6 },
  editBtn: { backgroundColor: '#eef4ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  editBtnText: { color: '#2563eb', fontWeight: '600', fontSize: 13 },
  deleteBtn: { backgroundColor: '#fff0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  deleteBtnText: { color: '#dc2626', fontWeight: '600', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 4 },

  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 12, backgroundColor: '#fafafa' },

  
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelButton: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: '#555' },
  saveBtn: { flex: 1, backgroundColor: '#3ECF8E', borderRadius: 8, padding: 12, alignItems: 'center' },
  saveBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },

  button: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, 
    paddingVertical: 8,
    backgroundColor: "#1A6CBE",
    borderRadius: 30,
    
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    alignSelf: "center",
    color: "#C8EAEA",
  },
  overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},

popup: {
  width: '80%',
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 20,
  alignItems: 'center',
},

popupTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 8,
},

popupText: {
  fontSize: 14,
  color: '#666',
  marginBottom: 20,
  textAlign: 'center',
},

popupActions: {
  flexDirection: 'row',
  gap: 10,
},

cancelBtn: {
  padding: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  flex: 1,
  alignItems: 'center',
},

confirmBtn: {
  padding: 10,
  backgroundColor: '#dc2626',
  borderRadius: 8,
  flex: 1,
  alignItems: 'center',
},
});
