import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
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
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/context/AppContext';
import { Role } from '@/types';

export const LoginView: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { loginWithRole, showAlert } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication routing
  const resolveRole = (input: string): { role: Role; roleName: string } => {
    const val = input.trim().toLowerCase();
    if (val === 'demo4' || val.includes('demo4') || val.includes('parent')) {
      return { role: 'parent', roleName: 'Parent Portal' };
    }
    if (val === 'demo3' || val.includes('demo3') || val.includes('student')) {
      return { role: 'student', roleName: 'Student Portal' };
    }
    if (val === 'demo2' || val.includes('demo2') || val.includes('teacher') || val.includes('sarah')) {
      return { role: 'teacher', roleName: 'Teacher Desk' };
    }
    // Default to School Admin
    return { role: 'admin', roleName: 'School Admin Portal' };
  };


  const handleSignIn = () => {
    if (!email.trim()) {
      showAlert({
        title: 'Required',
        message: 'Please enter your institutional email, phone number, or ID.',
        type: 'warning',
      });
      return;
    }
    if (!password.trim()) {
      showAlert({
        title: 'Required',
        message: 'Please enter your password.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const { role } = resolveRole(email);
      loginWithRole(role, { identifier: email, password });
    }, 200);
  };

  return (
    <View style={styles.screen}>
      {/* Subtle ambient glows on white canvas */}
      <View style={styles.ambientTopGlow} pointerEvents="none" />
      <View style={styles.ambientBottomGlow} pointerEvents="none" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            isDesktop && styles.scrollContentDesktop,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          <View style={[styles.mainContainer, isDesktop && styles.mainContainerDesktop]}>
            
            {/* BRAND LOGO & HEADER */}
            <View style={styles.brandHeader}>
              <LinearGradient
                colors={['#4F46E5', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoBadge}>
                <Ionicons name="school" size={32} color="#FFFFFF" />
              </LinearGradient>

              <Text style={styles.brandTitle}>EduPulse</Text>
              <Text style={styles.brandSubtitle}>
                Oakridge Unified School Ecosystem
              </Text>
            </View>


            {/* LOGIN FORM */}
            <View style={styles.formGroup}>
              {/* EMAIL / ID INPUT */}
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Institutional Email / Parent Phone / ID</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-circle-outline"
                    size={20}
                    color="#64748B"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.inputControl}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="email@oakridge.edu or mobile"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                  {email.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setEmail('')}
                      style={styles.clearBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* PASSWORD INPUT */}
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#64748B"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.inputControl}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* REMEMBER ME & FORGOT PASSWORD */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  activeOpacity={0.7}
                  onPress={() => setRememberMe(!rememberMe)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    showAlert({
                      title: 'Reset Password',
                      message: 'A password reset verification link has been dispatched to your registered email or phone.',
                      type: 'info',
                    })
                  }>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* SIGN IN BUTTON */}
              <TouchableOpacity
                style={[styles.signInBtn, isLoading && styles.signInBtnDisabled]}
                activeOpacity={0.85}
                disabled={isLoading}
                onPress={handleSignIn}>
                <LinearGradient
                  colors={['#4F46E5', '#6366F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signInGradient}>
                  <Text style={styles.signInBtnText}>
                    {isLoading ? 'Authenticating…' : 'Sign In to Portal'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>


            {/* ENTERPRISE COMPLIANCE FOOTER */}
            <View style={styles.footerContainer}>
              <Ionicons name="lock-closed" size={12} color="#94A3B8" />
              <Text style={styles.footerText}>
                256-Bit SSL Encrypted Institutional Access • Oakridge Academy
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },

  ambientTopGlow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#EEF2FF',
    opacity: 0.8,
  },
  ambientBottomGlow: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#F0FDF4',
    opacity: 0.7,
  },

  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  scrollContentDesktop: {
    alignItems: 'center',
    paddingVertical: 48,
  },

  mainContainer: {
    width: '100%',
  },
  mainContainerDesktop: {
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },

  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },

  formGroup: {
    gap: 16,
  },
  inputBlock: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputControl: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    paddingVertical: 0,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  eyeBtn: {
    padding: 4,
  },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  rememberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4F46E5',
  },

  signInBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  signInBtnDisabled: {
    opacity: 0.65,
  },
  signInGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
  },
  signInBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },

  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },


});
