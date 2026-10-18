import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from '@/components/common/AppCard';
import { StatusPill } from '@/components/common/StatusPill';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
}) => {
  const { notifications, markAllNotificationsRead } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'attendance' | 'academic' | 'emergency'>('all');

  const filtered = notifications.filter((n) => {
    if (selectedFilter === 'all') return true;
    return n.category === selectedFilter;
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Notifications</Text>
              <Text style={styles.subTitle}>Activity & School Broadcasts</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Palette.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}
            contentContainerStyle={styles.filterRow}>
            {(['all', 'attendance', 'academic', 'emergency'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedFilter(cat)}
                style={[
                  styles.filterPill,
                  selectedFilter === cat && styles.filterPillActive,
                ]}>
                <Text
                  style={[
                    styles.filterPillText,
                    selectedFilter === cat && styles.filterPillTextActive,
                  ]}>
                  {cat.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {filtered.map((item) => {
              const isEmergency = item.category === 'emergency';
              return (
                <AppCard
                  key={item.id}
                  style={[
                    styles.notifCard,
                    isEmergency && styles.emergencyCard,
                    !item.read && styles.unreadCard,
                  ]}>
                  <View style={styles.notifHeader}>
                    <StatusPill status={item.category} size="sm" />
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                  </View>
                  <Text style={[styles.notifTitle, isEmergency && { color: Palette.errorRed }]}>
                    {item.title}
                  </Text>
                  <Text style={styles.notifMessage}>{item.message}</Text>
                </AppCard>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={markAllNotificationsRead}>
              <Text style={styles.markReadText}>Mark all as read</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: Radii.modal,
    borderTopRightRadius: Radii.modal,
    maxHeight: '85%',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  headerLeft: {
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textDark,
  },
  subTitle: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScrollView: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    backgroundColor: Palette.background,
  },
  filterPillActive: {
    backgroundColor: Palette.primaryNavy,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingVertical: 14,
    gap: 10,
  },
  notifCard: {
    gap: 6,
    padding: 12,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: Palette.actionBlue,
  },
  emergencyCard: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FEB2B2',
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textDark,
  },
  notifMessage: {
    fontSize: 13,
    color: Palette.textDark,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
});
