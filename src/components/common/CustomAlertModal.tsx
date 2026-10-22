import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive' | 'primary';
}

export type AlertType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export interface CustomAlertConfig {
  title: string;
  message?: string;
  type?: AlertType;
  icon?: keyof typeof Ionicons.glyphMap;
  buttons?: AlertButton[];
}

interface CustomAlertModalProps {
  alert: CustomAlertConfig | null;
  onClose: () => void;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({ alert, onClose }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  if (!alert) return null;

  const type = alert.type || 'info';

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          iconName: (alert.icon || 'checkmark-circle') as keyof typeof Ionicons.glyphMap,
          iconColor: '#10B981',
          iconBg: '#ECFDF5',
          iconBorder: '#A7F3D0',
          accentColor: '#10B981',
        };
      case 'warning':
        return {
          iconName: (alert.icon || 'alert-circle') as keyof typeof Ionicons.glyphMap,
          iconColor: '#F59E0B',
          iconBg: '#FFFBEB',
          iconBorder: '#FDE68A',
          accentColor: '#F59E0B',
        };
      case 'error':
        return {
          iconName: (alert.icon || 'close-circle') as keyof typeof Ionicons.glyphMap,
          iconColor: '#EF4444',
          iconBg: '#FEF2F2',
          iconBorder: '#FECACA',
          accentColor: '#EF4444',
        };
      case 'confirm':
        return {
          iconName: (alert.icon || 'help-circle') as keyof typeof Ionicons.glyphMap,
          iconColor: '#4F46E5',
          iconBg: '#EEF2FF',
          iconBorder: '#C7D2FE',
          accentColor: '#4F46E5',
        };
      case 'info':
      default:
        return {
          iconName: (alert.icon || 'information-circle') as keyof typeof Ionicons.glyphMap,
          iconColor: '#4F46E5',
          iconBg: '#EEF2FF',
          iconBorder: '#C7D2FE',
          accentColor: '#4F46E5',
        };
    }
  };

  const theme = getTheme();

  // If no buttons are supplied, provide a default "Understood" / "OK" button
  const buttons: AlertButton[] =
    alert.buttons && alert.buttons.length > 0
      ? alert.buttons
      : [{ text: 'OK', style: 'primary' }];

  const handleButtonPress = (btn: AlertButton) => {
    onClose();
    if (btn.onPress) {
      // Small timeout to allow modal animation to clear
      setTimeout(() => {
        btn.onPress?.();
      }, 50);
    }
  };

  return (
    <Modal
      transparent
      visible={Boolean(alert)}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
          {/* Top Decorative Icon Badge */}
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: theme.iconBg, borderColor: theme.iconBorder },
            ]}>
            <Ionicons name={theme.iconName} size={30} color={theme.iconColor} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{alert.title}</Text>

          {/* Message */}
          {alert.message ? <Text style={styles.message}>{alert.message}</Text> : null}

          {/* Action Buttons */}
          <View
            style={[
              styles.buttonsContainer,
              buttons.length > 2 && styles.buttonsContainerColumn,
            ]}>
            {buttons.map((btn, index) => {
              const isCancel = btn.style === 'cancel';
              const isDestructive = btn.style === 'destructive';
              const isPrimary = btn.style === 'primary' || (!isCancel && !isDestructive);

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => handleButtonPress(btn)}
                  style={[
                    styles.button,
                    isCancel && styles.buttonCancel,
                    isDestructive && styles.buttonDestructive,
                    isPrimary && styles.buttonPrimary,
                  ]}>
                  <Text
                    style={[
                      styles.buttonText,
                      isCancel && styles.buttonTextCancel,
                      isDestructive && styles.buttonTextDestructive,
                      isPrimary && styles.buttonTextPrimary,
                    ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardDesktop: {
    maxWidth: 400,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    paddingHorizontal: 6,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginTop: 22,
  },
  buttonsContainerColumn: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonCancel: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonDestructive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextCancel: {
    color: '#64748B',
  },
  buttonTextDestructive: {
    color: '#FFFFFF',
  },
});
