import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { SchoolEvent } from '@/types';

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: SchoolEvent['category']; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'academic', label: 'Academic', icon: 'school-outline' },
  { id: 'sports', label: 'Sports', icon: 'football-outline' },
  { id: 'cultural', label: 'Cultural', icon: 'color-palette-outline' },
  { id: 'ptm', label: 'Parent-Teacher (PTM)', icon: 'people-outline' },
  { id: 'workshop', label: 'Workshop', icon: 'bulb-outline' },
  { id: 'holiday', label: 'Holiday', icon: 'calendar-outline' },
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { createEvent, showAlert, role } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SchoolEvent['category']>('academic');
  const [date, setDate] = useState('2026-11-10');
  const [time, setTime] = useState('09:30 AM – 01:30 PM');
  const [venue, setVenue] = useState('Central School Auditorium');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState<('all' | 'students' | 'parents' | 'teachers')[]>(['all']);

  const toggleAudience = (aud: 'all' | 'students' | 'parents' | 'teachers') => {
    if (aud === 'all') {
      setTargetAudience(['all']);
    } else {
      const filtered = targetAudience.filter((a) => a !== 'all');
      if (filtered.includes(aud)) {
        const remaining = filtered.filter((a) => a !== aud);
        setTargetAudience(remaining.length === 0 ? ['all'] : remaining);
      } else {
        setTargetAudience([...filtered, aud]);
      }
    }
  };

  const handleCreate = () => {
    if (!title.trim()) {
      showAlert({
        title: 'Required Field',
        message: 'Please enter the event title.',
        type: 'warning',
      });
      return;
    }

    createEvent({
      title: title.trim(),
      category,
      date,
      time,
      venue: venue.trim() || 'Campus Grounds',
      targetAudience,
      description: description.trim() || 'Official school event. All designated participants are invited to attend.',
      organizer: role === 'teacher' ? 'Grade Faculty Office' : 'School Administration',
    });

    showAlert({
      title: 'Event Published! 📅',
      message: `"${title}" has been added to the school calendar and broadcast notifications dispatched to ${targetAudience.join(', ')}.`,
      type: 'success',
      icon: 'calendar-outline',
    });

    // Reset
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.headerTitle}>Create School Event</Text>
            <Text style={styles.headerSubtitle}>Publish to calendars & trigger notifications</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#475569" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.formContent, isDesktop && styles.formDesktop]}
            showsVerticalScrollIndicator={false}>
            {/* EVENT TITLE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Science & Innovation Fair 2026"
                placeholderTextColor="#94A3B8"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* CATEGORY PICKER */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Category</Text>
              <View style={styles.categoriesRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                      onPress={() => setCategory(cat.id)}>
                      <Ionicons
                        name={cat.icon}
                        size={15}
                        color={isSelected ? '#FFFFFF' : '#475569'}
                      />
                      <Text
                        style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* DATE & TIME */}
            <View style={styles.rowFields}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="calendar-outline" size={18} color="#64748B" />
                  <TextInput
                    style={styles.inputControl}
                    value={date}
                    onChangeText={setDate}
                    placeholder="2026-11-10"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Timing</Text>
                <View style={styles.iconInput}>
                  <Ionicons name="time-outline" size={18} color="#64748B" />
                  <TextInput
                    style={styles.inputControl}
                    value={time}
                    onChangeText={setTime}
                    placeholder="09:00 AM – 02:00 PM"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* VENUE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Venue / Location</Text>
              <View style={styles.iconInput}>
                <Ionicons name="location-outline" size={18} color="#64748B" />
                <TextInput
                  style={styles.inputControl}
                  value={venue}
                  onChangeText={setVenue}
                  placeholder="Auditorium, Block A, or Sports Field"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* AUDIENCE TARGET */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Target Audience</Text>
              <View style={styles.audienceRow}>
                {(['all', 'students', 'parents', 'teachers'] as const).map((aud) => {
                  const isSelected = targetAudience.includes(aud);
                  return (
                    <TouchableOpacity
                      key={aud}
                      style={[styles.audienceChip, isSelected && styles.audienceChipActive]}
                      onPress={() => toggleAudience(aud)}>
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                        size={15}
                        color={isSelected ? '#4F46E5' : '#94A3B8'}
                      />
                      <Text style={[styles.audienceText, isSelected && styles.audienceTextActive]}>
                        {aud === 'all'
                          ? 'Everyone'
                          : aud.charAt(0).toUpperCase() + aud.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* DESCRIPTION */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Description & Instructions</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Provide briefing notes, schedule rundown, and what participants should bring..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* PUBLISH BUTTON */}
            <TouchableOpacity style={styles.publishBtn} onPress={handleCreate} activeOpacity={0.85}>
              <Ionicons name="megaphone" size={18} color="#FFFFFF" />
              <Text style={styles.publishBtnText}>Publish & Broadcast Event</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContent: {
    padding: 16,
    gap: 16,
  },
  formDesktop: {
    maxWidth: 620,
    width: '100%',
    alignSelf: 'center',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
    height: 48,
  },
  inputControl: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  audienceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  audienceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  audienceChipActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  audienceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  audienceTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
