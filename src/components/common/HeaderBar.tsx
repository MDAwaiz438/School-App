import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface HeaderBarProps {
  onNotificationPress?: () => void;
  onChildPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onNotificationPress,
  onChildPress,
}) => {
  const { role, selectedStudent, allStudents, setSelectedStudentId, notifications } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNextChild = () => {
    if (onChildPress) {
      onChildPress();
      return;
    }
    // Cycle children if multiple
    if (allStudents.length > 1) {
      const currentIndex = allStudents.findIndex((s) => s.id === selectedStudent.id);
      const nextIndex = (currentIndex + 1) % allStudents.length;
      setSelectedStudentId(allStudents[nextIndex].id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Left side: Profile info depending on role */}
        {role === 'parent' || role === 'student' ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNextChild}
            style={styles.profileSection}>
            <Image source={{ uri: selectedStudent.avatar }} style={styles.avatar} />
            <View style={styles.profileTextCol}>
              <View style={styles.nameRow}>
                <Text style={styles.studentName} numberOfLines={1} ellipsizeMode="tail">
                  {selectedStudent.name}
                </Text>
                {role === 'parent' && allStudents.length > 1 && (
                  <View style={styles.switchChildPill}>
                    <Text style={styles.switchChildText}>Switch</Text>
                    <Ionicons name="swap-horizontal" size={10} color={Palette.actionBlue} />
                  </View>
                )}
              </View>
              <Text style={styles.studentSub} numberOfLines={1} ellipsizeMode="tail">
                {selectedStudent.grade} - {selectedStudent.section} • Roll #{selectedStudent.rollNo}
              </Text>
            </View>
          </TouchableOpacity>
        ) : role === 'teacher' ? (
          <View style={styles.profileSection}>
            <View style={[styles.avatar, styles.teacherAvatarBg]}>
              <Ionicons name="school" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.profileTextCol}>
              <Text style={styles.studentName} numberOfLines={1} ellipsizeMode="tail">
                Mrs. Sarah Jenkins
              </Text>
              <Text style={styles.studentSub} numberOfLines={1} ellipsizeMode="tail">
                Class Teacher • Grade 8-A
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.profileSection}>
            <View style={[styles.avatar, styles.adminAvatarBg]}>
              <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.profileTextCol}>
              <Text style={styles.studentName} numberOfLines={1} ellipsizeMode="tail">
                School Administration
              </Text>
              <Text style={styles.studentSub} numberOfLines={1} ellipsizeMode="tail">
                Oakridge Academy Portal
              </Text>
            </View>
          </View>
        )}

        {/* Right side: Notification Icon with badge */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onNotificationPress}
            style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color={Palette.primaryNavy} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  profileTextCol: {
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.border,
  },
  teacherAvatarBg: {
    backgroundColor: Palette.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminAvatarBg: {
    backgroundColor: Palette.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
  },
  switchChildPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.blueTint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.pill,
    gap: 2,
  },
  switchChildText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  studentSub: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Palette.errorRed,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
