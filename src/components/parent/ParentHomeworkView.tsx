import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBar } from '@/components/common/HeaderBar';
import { Palette, Breakpoints } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface ParentHomeworkViewProps {
  onBack?: () => void;
}

export const ParentHomeworkView: React.FC<ParentHomeworkViewProps> = ({ onBack }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= Breakpoints.tablet;
  const { homeworkList, toggleHomeworkStatus } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredHomework = homeworkList.filter((item) => {
    if (activeFilter === 'pending') return item.status === 'pending';
    if (activeFilter === 'completed') return item.status === 'completed';
    return true;
  });

  const getSubjectTheme = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return {
          tagBg: '#EFF6FF',
          tagText: '#2F80ED',
          iconColor: '#2F80ED',
        };
      case 'science':
      case 'science & physics':
        return {
          tagBg: '#ECFDF5',
          tagText: '#27AE60',
          iconColor: '#27AE60',
        };
      case 'english':
      case 'english literature':
        return {
          tagBg: '#F5F3FF',
          tagText: '#7C3AED',
          iconColor: '#7C3AED',
        };
      case 'social studies':
      case 'history':
        return {
          tagBg: '#FFFBEB',
          tagText: '#F2994A',
          iconColor: '#F2994A',
        };
      default:
        return {
          tagBg: '#EFF6FF',
          tagText: '#2F80ED',
          iconColor: '#2F80ED',
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <HeaderBar
        title="Assignments"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          isTablet && styles.contentContainerTablet,
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Pill Filter Tabs */}
        <View style={styles.filterBar}>
          {(['all', 'pending', 'completed'] as const).map((tab) => {
            const isActive = activeFilter === tab;
            const label = tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveFilter(tab)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${label} assignments`}
                accessibilityState={{ selected: isActive }}
                style={[styles.filterPill, isActive && styles.filterPillActive]}>
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Homework Cards List */}
        <View style={styles.hwList}>
          {filteredHomework.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No assignments found</Text>
              <Text style={styles.emptySub}>
                There are no {activeFilter} homework tasks at this time.
              </Text>
            </View>
          ) : (
            filteredHomework.map((item) => {
              const theme = getSubjectTheme(item.subject);
              const isCompleted = item.status === 'completed';

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleHomeworkStatus(item.id)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.subject}: ${item.title}. Status: ${
                    isCompleted ? 'Completed' : 'Pending'
                  }. ${item.dueDate}`}
                  style={styles.card}>
                  <View style={styles.cardContent}>
                    {/* Left document icon inside colored square */}
                    <View style={[styles.docIconBox, { backgroundColor: theme.tagBg }]}>
                      <Ionicons name="document-text-outline" size={24} color={theme.iconColor} />
                    </View>

                    {/* Center Details */}
                    <View style={styles.detailsCol}>
                      {/* Tags row: Subject + Status */}
                      <View style={styles.tagRow}>
                        <View style={[styles.subjectTag, { backgroundColor: theme.tagBg }]}>
                          <Text
                            style={[styles.subjectTagText, { color: theme.tagText }]}
                            numberOfLines={1}>
                            {item.subject}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.statusPill,
                            isCompleted ? styles.statusPillCompleted : styles.statusPillPending,
                          ]}>
                          <Text
                            style={[
                              styles.statusPillText,
                              isCompleted
                                ? styles.statusPillTextCompleted
                                : styles.statusPillTextPending,
                            ]}>
                            {isCompleted ? 'Completed' : 'Pending'}
                          </Text>
                        </View>
                      </View>

                      {/* Assignment Title */}
                      <Text style={styles.assignmentTitle} numberOfLines={2} ellipsizeMode="tail">
                        {item.title}
                      </Text>

                      {/* Assignment Description snippet */}
                      <Text style={styles.assignmentDescription} numberOfLines={2}>
                        {item.description}
                      </Text>

                      {/* Due Date */}
                      <View style={styles.dueRow}>
                        <Ionicons name="calendar-outline" size={14} color="#EB5757" />
                        <Text style={styles.dueDateText} numberOfLines={1}>
                          {item.dueDate}
                        </Text>
                      </View>
                    </View>

                    {/* Right Chevron */}
                    <View style={styles.chevronCol}>
                      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  headerBar: {
    backgroundColor: '#102A43',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    minHeight: 56,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  contentContainerTablet: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    borderRadius: 24,
    padding: 4,
    minHeight: 48,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    minHeight: 40,
  },
  filterPillActive: {
    backgroundColor: '#2F80ED',
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  hwList: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#102A43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  detailsCol: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  subjectTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: '65%',
  },
  subjectTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillPending: {
    backgroundColor: '#FFEDD5',
  },
  statusPillTextPending: {
    color: '#F2994A',
  },
  statusPillCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusPillTextCompleted: {
    color: '#27AE60',
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17202A',
    marginTop: 2,
  },
  assignmentDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EB5757',
  },
  chevronCol: {
    alignSelf: 'center',
    paddingLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#17202A',
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});
