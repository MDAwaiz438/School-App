import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_MULTI_CLASS_ATTENDANCE } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

const CLASSES = [
  'All Classes',
  'Grade 8-A',
  'Grade 8-B',
  'Grade 9-A',
  'Grade 9-B',
  'Grade 10-A',
];

const PERIOD_FILTERS = [
  'Today (20 Oct 2026)',
  'This Week (16-20 Oct)',
  'Current Month (Oct 2026)',
  'Term 1 (Aug - Oct 2026)',
];

const STATUS_FILTERS = ['All Statuses', 'Present', 'Absent', 'Leave'];

export const AttendanceExcelExportView: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { showAlert } = useApp();

  const [selectedClass, setSelectedClass] = useState('Grade 8-A');
  const [selectedPeriod, setSelectedPeriod] = useState('Current Month (Oct 2026)');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students based on Class, Status, Search
  const filteredStudents = MOCK_MULTI_CLASS_ATTENDANCE.filter((s) => {
    // Class filter
    if (selectedClass !== 'All Classes') {
      const parts = selectedClass.split('-');
      const gradePart = parts[0]; // e.g. "Grade 8"
      const sectionPart = parts[1]; // e.g. "A"
      if (s.className !== gradePart || s.section !== sectionPart) {
        return false;
      }
    }

    // Status filter
    if (selectedStatus !== 'All Statuses') {
      if (s.status.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = s.name.toLowerCase().includes(q);
      const matchRoll = s.rollNo.toLowerCase().includes(q);
      if (!matchName && !matchRoll) return false;
    }

    return true;
  });

  const presentCount = filteredStudents.filter((s) => s.status === 'present').length;
  const absentCount = filteredStudents.filter((s) => s.status === 'absent').length;
  const leaveCount = filteredStudents.filter((s) => s.status === 'leave').length;
  const avgAttendance =
    filteredStudents.length > 0
      ? (
          filteredStudents.reduce((acc, curr) => acc + curr.attendanceRate, 0) /
          filteredStudents.length
        ).toFixed(1)
      : '0.0';

  // Excel / CSV Export Generator
  const handleDownloadExcel = () => {
    if (filteredStudents.length === 0) {
      showAlert({
        title: 'No Data to Export',
        message: 'No student attendance records matched your current filter criteria.',
        type: 'warning',
      });
      return;
    }

    // Generate RFC 4180 compliant CSV string with UTF-8 BOM for Microsoft Excel compatibility
    const headers = [
      'Roll Number',
      'Student Name',
      'Grade Class',
      'Section',
      'Gender',
      'Parent Contact',
      'Total Working Days',
      'Days Present',
      'Days Absent',
      'Days Leave',
      'Attendance Percentage',
      'Status Today',
      'Period Range',
      'Generated At',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.rollNo}"`,
      `"${s.name}"`,
      `"${s.className}"`,
      `"${s.section}"`,
      `"${s.gender}"`,
      `"${s.contact}"`,
      s.totalDays,
      s.presentDays,
      s.absentDays,
      s.leaveDays,
      `"${s.attendanceRate}%"`,
      `"${s.status.toUpperCase()}"`,
      `"${selectedPeriod}"`,
      `"${new Date().toLocaleString()}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const filename = `Attendance_Report_${selectedClass.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showAlert({
          title: 'Excel Report Downloaded! 📊',
          message: `Successfully generated and downloaded ${filename} with ${filteredStudents.length} student records for ${selectedClass}. Opens directly in Microsoft Excel & Google Sheets.`,
          type: 'success',
          icon: 'download-outline',
        });
      } catch (err) {
        console.error('Web download error:', err);
      }
    } else {
      // Mobile / Native Share or Alert
      Share.share({
        title: `Attendance Report - ${selectedClass}`,
        message: `Attendance Report for ${selectedClass} (${selectedPeriod})\n\nTotal Students: ${filteredStudents.length}\nAvg Attendance: ${avgAttendance}%\nPresent: ${presentCount} | Absent: ${absentCount} | Leave: ${leaveCount}\n\n${csvContent}`,
      }).catch(() => {});

      showAlert({
        title: 'Attendance Report Generated 📊',
        message: `Exported ${filteredStudents.length} records for ${selectedClass}. Excel CSV file formatted with UTF-8 BOM.`,
        type: 'success',
        icon: 'checkmark-circle',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Ionicons name="document-text" size={24} color="#4F46E5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Download Attendance Excel</Text>
            <Text style={styles.subtitle}>
              Filter by class, period, and status to export official spreadsheets
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.downloadExcelBtn}
          onPress={handleDownloadExcel}
          activeOpacity={0.85}>
          <Ionicons name="cloud-download" size={18} color="#FFFFFF" />
          <Text style={styles.downloadExcelBtnText}>Export Excel (.xlsx / .csv)</Text>
        </TouchableOpacity>
      </View>

      {/* FILTER CONTROLS */}
      <View style={styles.filtersWrapper}>
        {/* CLASS SELECTION */}
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionLabel}>Select Class / Grade:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}>
            {CLASSES.map((cls) => {
              const isSelected = selectedClass === cls;
              return (
                <TouchableOpacity
                  key={cls}
                  style={[styles.classChip, isSelected && styles.classChipActive]}
                  onPress={() => setSelectedClass(cls)}>
                  <Ionicons
                    name="school"
                    size={14}
                    color={isSelected ? '#FFFFFF' : '#64748B'}
                  />
                  <Text style={[styles.classChipText, isSelected && styles.classChipTextActive]}>
                    {cls}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* PERIOD & STATUS FILTERS ROW */}
        <View style={styles.twoColumnFilters}>
          {/* PERIOD FILTER */}
          <View style={styles.filterCol}>
            <Text style={styles.filterSectionLabel}>Date Range / Period:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {PERIOD_FILTERS.map((p) => {
                const isSelected = selectedPeriod === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.periodChip, isSelected && styles.periodChipActive]}
                    onPress={() => setSelectedPeriod(p)}>
                    <Text style={[styles.periodChipText, isSelected && styles.periodChipTextActive]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* STATUS FILTER */}
          <View style={styles.filterCol}>
            <Text style={styles.filterSectionLabel}>Attendance Status:</Text>
            <View style={styles.statusChipsRow}>
              {STATUS_FILTERS.map((st) => {
                const isSelected = selectedStatus === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[styles.statusChip, isSelected && styles.statusChipActive]}
                    onPress={() => setSelectedStatus(st)}>
                    <Text style={[styles.statusChipText, isSelected && styles.statusChipTextActive]}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name or roll number..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* METRICS SUMMARY STRIP */}
      <View style={styles.summaryStrip}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{filteredStudents.length}</Text>
          <Text style={styles.metricLabel}>Total Students</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: '#059669' }]}>{presentCount}</Text>
          <Text style={styles.metricLabel}>Present Today</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: '#DC2626' }]}>{absentCount}</Text>
          <Text style={styles.metricLabel}>Absent Today</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: '#D97706' }]}>{leaveCount}</Text>
          <Text style={styles.metricLabel}>On Leave</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: '#4F46E5' }]}>{avgAttendance}%</Text>
          <Text style={styles.metricLabel}>Avg Rate</Text>
        </View>
      </View>

      {/* LIVE DATA TABLE PREVIEW */}
      <View style={styles.tableCard}>
        <View style={styles.tableTopHeader}>
          <Text style={styles.tableHeading}>
            Filtered Roster Preview ({filteredStudents.length} Students)
          </Text>
          <Text style={styles.tableSub}>{selectedClass} • {selectedPeriod}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableContainer}>
            {/* Table Header Row */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.thCell, { width: 75 }]}>Roll No</Text>
              <Text style={[styles.thCell, { width: 160 }]}>Student Name</Text>
              <Text style={[styles.thCell, { width: 85 }]}>Class</Text>
              <Text style={[styles.thCell, { width: 80 }]}>Working</Text>
              <Text style={[styles.thCell, { width: 75 }]}>Present</Text>
              <Text style={[styles.thCell, { width: 75 }]}>Absent</Text>
              <Text style={[styles.thCell, { width: 75 }]}>Leave</Text>
              <Text style={[styles.thCell, { width: 95 }]}>Rate (%)</Text>
              <Text style={[styles.thCell, { width: 100 }]}>Status</Text>
            </View>

            {/* Table Data Rows */}
            {filteredStudents.length === 0 ? (
              <View style={styles.noDataRow}>
                <Text style={styles.noDataText}>No students match the chosen filters.</Text>
              </View>
            ) : (
              filteredStudents.map((std, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <View
                    key={std.id}
                    style={[styles.tableDataRow, isEven && styles.tableDataRowEven]}>
                    <Text style={[styles.tdCell, styles.boldCell, { width: 75 }]}>
                      {std.rollNo}
                    </Text>
                    <Text style={[styles.tdCell, styles.boldCell, { width: 160 }]}>
                      {std.name}
                    </Text>
                    <Text style={[styles.tdCell, { width: 85 }]}>
                      {std.className}-{std.section}
                    </Text>
                    <Text style={[styles.tdCell, { width: 80 }]}>{std.totalDays}</Text>
                    <Text style={[styles.tdCell, { width: 75, color: '#059669', fontWeight: '700' }]}>
                      {std.presentDays}
                    </Text>
                    <Text style={[styles.tdCell, { width: 75, color: '#DC2626', fontWeight: '700' }]}>
                      {std.absentDays}
                    </Text>
                    <Text style={[styles.tdCell, { width: 75, color: '#D97706', fontWeight: '700' }]}>
                      {std.leaveDays}
                    </Text>
                    <Text style={[styles.tdCell, { width: 95, fontWeight: '800' }]}>
                      {std.attendanceRate}%
                    </Text>
                    <View style={{ width: 100 }}>
                      <View
                        style={[
                          styles.statusBadge,
                          std.status === 'present'
                            ? styles.badgePresent
                            : std.status === 'absent'
                            ? styles.badgeAbsent
                            : styles.badgeLeave,
                        ]}>
                        <Text
                          style={[
                            styles.badgeText,
                            std.status === 'present'
                              ? { color: '#065F46' }
                              : std.status === 'absent'
                              ? { color: '#991B1B' }
                              : { color: '#92400E' },
                          ]}>
                          {std.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexWrap: 'wrap',
    gap: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 260,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  downloadExcelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  downloadExcelBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filtersWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  filterSection: {
    gap: 6,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  classChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  classChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  classChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  classChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  twoColumnFilters: {
    gap: 12,
  },
  filterCol: {
    gap: 6,
  },
  periodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  periodChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  periodChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  periodChipTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  statusChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  statusChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  statusChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tableTopHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tableSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tableContainer: {
    minWidth: 800,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  thCell: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableDataRowEven: {
    backgroundColor: '#F8FAFC',
  },
  tdCell: {
    fontSize: 12,
    color: '#334155',
  },
  boldCell: {
    fontWeight: '700',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgePresent: {
    backgroundColor: '#ECFDF5',
  },
  badgeAbsent: {
    backgroundColor: '#FEF2F2',
  },
  badgeLeave: {
    backgroundColor: '#FFFBEB',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  noDataRow: {
    padding: 24,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 13,
    color: '#94A3B8',
  },
});
