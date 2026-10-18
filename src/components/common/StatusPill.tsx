import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Palette, Radii } from '@/constants/theme';

type StatusType =
  | 'present'
  | 'absent'
  | 'leave'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'emergency'
  | 'important'
  | 'normal'
  | 'paid'
  | 'overdue';

interface StatusPillProps {
  status: StatusType | string;
  label?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  present: { bg: Palette.greenTint, text: Palette.successGreen, label: 'Present' },
  absent: { bg: Palette.redTint, text: Palette.errorRed, label: 'Absent' },
  leave: { bg: Palette.orangeTint, text: Palette.warningOrange, label: 'Leave' },
  pending: { bg: Palette.orangeTint, text: Palette.warningOrange, label: 'Pending' },
  approved: { bg: Palette.greenTint, text: Palette.successGreen, label: 'Approved' },
  rejected: { bg: Palette.redTint, text: Palette.errorRed, label: 'Rejected' },
  completed: { bg: Palette.greenTint, text: Palette.successGreen, label: 'Completed' },
  emergency: { bg: Palette.redTint, text: Palette.errorRed, label: 'Emergency' },
  important: { bg: Palette.orangeTint, text: Palette.warningOrange, label: 'Important' },
  normal: { bg: Palette.blueTint, text: Palette.actionBlue, label: 'Notice' },
  paid: { bg: Palette.greenTint, text: Palette.successGreen, label: 'Paid' },
  overdue: { bg: Palette.redTint, text: Palette.errorRed, label: 'Overdue' },
};

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  label,
  style,
  textStyle,
  size = 'md',
}) => {
  const normalizedKey = status.toLowerCase();
  const config = STATUS_CONFIG[normalizedKey] || {
    bg: Palette.navyTint,
    text: Palette.primaryNavy,
    label: status,
  };

  return (
    <View
      style={[
        styles.pill,
        size === 'sm' && styles.pillSmall,
        { backgroundColor: config.bg },
        style,
      ]}>
      <View style={[styles.dot, { backgroundColor: config.text }]} />
      <Text
        style={[
          styles.text,
          size === 'sm' && styles.textSmall,
          { color: config.text },
          textStyle,
        ]}>
        {label || config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
    gap: 6,
  },
  pillSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  textSmall: {
    fontSize: 11,
  },
});
