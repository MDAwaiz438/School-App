import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/components/common/AppButton';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { MOCK_SCHOOL } from '@/data/mockData';

interface AuthModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onDismiss }) => {
  const { allStudents, setSelectedStudentId, login } = useApp();
  const [step, setStep] = useState<'splash' | 'login' | 'otp' | 'select_student'>('splash');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [otp, setOtp] = useState(['5', '8', '2', '4', '0', '1']);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    if (visible && step === 'splash') {
      const timerId = setTimeout(() => {
        setStep('login');
      }, 1800);
      return () => clearTimeout(timerId);
    }
  }, [visible, step]);

  const handleSendOtp = () => {
    setStep('otp');
    setTimer(45);
  };

  const handleVerifyOtp = () => {
    login(phone, otp.join(''));
    if (allStudents.length > 1) {
      setStep('select_student');
    } else {
      onDismiss();
    }
  };

  const handleSelectChild = (id: string) => {
    setSelectedStudentId(id);
    onDismiss();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        {/* STEP 1: SPLASH SCREEN (01) */}
        {step === 'splash' && (
          <View style={styles.splashScreen}>
            <View style={styles.splashLogoContainer}>
              <View style={styles.splashLogoCircle}>
                <Ionicons name="school" size={54} color="#FFFFFF" />
              </View>
              <Text style={styles.splashAppName}>{MOCK_SCHOOL.name}</Text>
              <Text style={styles.splashTagline}>{MOCK_SCHOOL.tagline}</Text>
            </View>
            <Text style={styles.splashVersion}>Version 1.0 • Unified Ecosystem</Text>
          </View>
        )}

        {/* STEP 2: LOGIN SCREEN (02) */}
        {step === 'login' && (
          <View style={styles.authScreen}>
            <View style={styles.headerArea}>
              <View style={styles.miniLogoCircle}>
                <Ionicons name="school" size={28} color={Palette.primaryNavy} />
              </View>
              <Text style={styles.authTitle}>Welcome Back</Text>
              <Text style={styles.authSub}>
                Enter your registered mobile number to access your student's dashboard.
              </Text>
            </View>

            <View style={styles.formArea}>
              <Text style={styles.inputLabel}>Mobile Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>+1</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="(555) 000-0000"
                  keyboardType="phone-pad"
                />
              </View>

              <AppButton
                title="Continue with OTP"
                variant="primary"
                size="lg"
                onPress={handleSendOtp}
                style={{ marginTop: 8 }}
              />

              <TouchableOpacity
                style={styles.schoolIdLink}
                onPress={() => alert('School ID Login option')}>
                <Text style={styles.schoolIdText}>Log in with School ID or Password</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.supportFooter}>
              <Text style={styles.supportText}>Need assistance? Contact school support at</Text>
              <Text style={styles.supportLink}>helpdesk@oakridge.edu</Text>
            </View>
          </View>
        )}

        {/* STEP 3: OTP VERIFICATION (03) */}
        {step === 'otp' && (
          <View style={styles.authScreen}>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep('login')}>
              <Ionicons name="arrow-back" size={24} color={Palette.primaryNavy} />
            </TouchableOpacity>

            <View style={styles.headerArea}>
              <Text style={styles.authTitle}>Verify Code</Text>
              <Text style={styles.authSub}>
                We sent a 6-digit verification code to {phone}.
              </Text>
            </View>

            <View style={styles.otpSlotsRow}>
              {otp.map((digit, idx) => (
                <View key={idx} style={styles.otpSlot}>
                  <Text style={styles.otpDigit}>{digit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.timerRow}>
              <Text style={styles.resendText}>Resend code in {timer}s</Text>
            </View>

            <AppButton
              title="Verify & Proceed"
              variant="action"
              size="lg"
              onPress={handleVerifyOtp}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {/* STEP 4: SELECT STUDENT (04) */}
        {step === 'select_student' && (
          <View style={styles.authScreen}>
            <View style={styles.headerArea}>
              <Text style={styles.authTitle}>Select Student</Text>
              <Text style={styles.authSub}>
                Choose which child's academic profile you wish to manage today.
              </Text>
            </View>

            <View style={styles.childrenList}>
              {allStudents.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={styles.childCard}
                  activeOpacity={0.8}
                  onPress={() => handleSelectChild(child.id)}>
                  <Image source={{ uri: child.avatar }} style={styles.childAvatar} />
                  <View style={styles.childMeta}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childClass}>
                      {child.grade} - Section {child.section} • Roll #{child.rollNo}
                    </Text>
                    <Text style={styles.childAttendance}>
                      Attendance: {child.attendancePercentage}% (Good Standing)
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Palette.actionBlue} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addChildLink}
              onPress={() => alert('Link another child with School Admission Number')}>
              <Ionicons name="add-circle-outline" size={18} color={Palette.actionBlue} />
              <Text style={styles.addChildText}>Link Another Child</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.surface,
  },
  splashScreen: {
    flex: 1,
    backgroundColor: Palette.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  splashLogoContainer: {
    alignItems: 'center',
    gap: 14,
  },
  splashLogoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Palette.actionBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashAppName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  splashTagline: {
    fontSize: 14,
    color: '#B0C8E8',
    textAlign: 'center',
  },
  splashVersion: {
    position: 'absolute',
    bottom: 30,
    fontSize: 12,
    color: '#7F9BB8',
  },
  authScreen: {
    flex: 1,
    backgroundColor: Palette.surface,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
    gap: 20,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: Palette.background,
  },
  miniLogoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.navyTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerArea: {
    gap: 6,
  },
  authTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Palette.textDark,
  },
  authSub: {
    fontSize: 14,
    color: Palette.textSecondary,
    lineHeight: 20,
  },
  formArea: {
    gap: 12,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
    overflow: 'hidden',
  },
  countryCodeBox: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 16,
    color: Palette.textDark,
  },
  schoolIdLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  schoolIdText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.actionBlue,
  },
  supportFooter: {
    marginTop: 'auto',
    paddingTop: 24,
    alignItems: 'center',
    gap: 2,
  },
  supportText: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  supportLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  otpSlotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: 14,
  },
  otpSlot: {
    flex: 1,
    height: 48,
    maxWidth: 50,
    borderRadius: Radii.sm,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.primaryNavy,
  },
  timerRow: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  childrenList: {
    gap: 12,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Palette.background,
    borderRadius: Radii.card,
    borderWidth: 1.5,
    borderColor: Palette.borderSubtle,
    gap: 14,
  },
  childAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.border,
  },
  childMeta: {
    flex: 1,
    gap: 2,
  },
  childName: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textDark,
  },
  childClass: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  childAttendance: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.successGreen,
    marginTop: 2,
  },
  addChildLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  addChildText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
});
