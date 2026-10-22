import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Role } from '@/types';

const ROLES: { id: Role; label: string; shortLabel: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'parent', label: 'Parent Portal', shortLabel: 'Parent', icon: 'people' },
  { id: 'student', label: 'Student Portal', shortLabel: 'Student', icon: 'school' },
  { id: 'teacher', label: 'Teacher Portal', shortLabel: 'Teacher', icon: 'book' },
  { id: 'admin', label: 'School Admin', shortLabel: 'Admin', icon: 'shield' },
];

interface RoleSwitcherProps {
  viewMode?: 'responsive' | 'mobile_frame';
  onToggleViewMode?: (mode: 'responsive' | 'mobile_frame') => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  viewMode = 'responsive',
  onToggleViewMode,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const isMobile = width < 600;
  const { role, setRole } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={styles.leftGroup}>
          {!isMobile && <Text style={styles.eyebrow}>ECOSYSTEM ROLE:</Text>}
          <View style={styles.rolesRow}>
            {ROLES.map((r) => {
              const isActive = role === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setRole(r.id)}
                  activeOpacity={0.8}
                  style={[styles.roleTab, isActive && styles.roleTabActive]}>
                  <Ionicons
                    name={r.icon}
                    size={14}
                    color={isActive ? '#FFFFFF' : Palette.textSecondary}
                  />
                  <Text style={[styles.roleText, isActive && styles.roleTextActive]}>
                    {isMobile ? r.shortLabel : r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Desktop View Mode Toggle (For Mobile App Roles) */}
        {isDesktop && role !== 'admin' && onToggleViewMode && (
          <View style={styles.viewModeGroup}>
            <TouchableOpacity
              onPress={() => onToggleViewMode('responsive')}
              style={[
                styles.modeBtn,
                viewMode === 'responsive' && styles.modeBtnActive,
              ]}>
              <Ionicons
                name="desktop-outline"
                size={13}
                color={viewMode === 'responsive' ? '#FFFFFF' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.modeBtnText,
                  viewMode === 'responsive' && styles.modeBtnTextActive,
                ]}>
                Responsive
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onToggleViewMode('mobile_frame')}
              style={[
                styles.modeBtn,
                viewMode === 'mobile_frame' && styles.modeBtnActive,
              ]}>
              <Ionicons
                name="phone-portrait-outline"
                size={13}
                color={viewMode === 'mobile_frame' ? '#FFFFFF' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.modeBtnText,
                  viewMode === 'mobile_frame' && styles.modeBtnTextActive,
                ]}>
                Mobile Frame
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B1B2B',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1A334E',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: 6,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7F9BB8',
    letterSpacing: 0.8,
  },
  rolesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: 4,
  },
  roleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radii.sm,
    backgroundColor: 'transparent',
    flex: 1,
  },
  roleTabActive: {
    backgroundColor: Palette.actionBlue,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A0B2C6',
  },
  roleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewModeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13283E',
    borderRadius: Radii.sm,
    padding: 2,
    gap: 2,
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.xs,
  },
  modeBtnActive: {
    backgroundColor: '#1E3A5F',
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
