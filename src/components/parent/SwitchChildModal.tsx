import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface SwitchChildModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SwitchChildModal: React.FC<SwitchChildModalProps> = ({ visible, onClose }) => {
  const { allStudents, selectedStudent, setSelectedStudentId, logout } = useApp();

  const handleSelect = (id: string) => {
    setSelectedStudentId(id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerTitleCol}>
              <Text style={styles.title}>Student Profiles</Text>
              <Text style={styles.subtitle}>Select which child's academic portal to view</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Palette.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {allStudents.map((child) => {
              const isSelected = child.id === selectedStudent.id;
              return (
                <TouchableOpacity
                  key={child.id}
                  style={[styles.childItem, isSelected && styles.childItemActive]}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(child.id)}>
                  <Image source={{ uri: child.avatar }} style={styles.avatar} />
                  <View style={styles.meta}>
                    <Text style={styles.name}>{child.name}</Text>
                    <Text style={styles.grade}>
                      {child.grade} - {child.section} • Roll #{child.rollNo}
                    </Text>
                    <Text style={styles.attendance}>
                      Attendance: {child.attendancePercentage}% (Good Standing)
                    </Text>
                  </View>
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'chevron-forward'}
                    size={22}
                    color={isSelected ? '#2563EB' : '#94A3B8'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.switchAccountBtn}
              onPress={() => {
                onClose();
                logout();
              }}>
              <Ionicons name="log-out-outline" size={16} color="#DC2626" />
              <Text style={styles.switchAccountText}>Sign Out to Login Page</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.modal,
    padding: 20,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    paddingBottom: 12,
  },
  headerTitleCol: {
    gap: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 10,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radii.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  childItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#CBD5E1',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  grade: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  attendance: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 2,
  },
  footerRow: {
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 12,
    alignItems: 'center',
  },
  switchAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  switchAccountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
});
