import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Delete } from 'lucide-react-native';
import { Typography, Button } from '../../components';
import { COLORS, SPACING, RADIUS } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../api/authService';
import { notificationService } from '../../api/notificationService';

type Props = {
  route: any;
  navigation: any;
};

const NUMPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'delete'],
];

export const OTPScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const { setAuth } = useAppStore();
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleKeyPress = (key: string) => {
    if (key === 'delete') {
      setOtp((prev) => prev.slice(0, -1));
    } else if (key && otp.length < 4) {
      setOtp((prev) => prev + key);
    }
  };

  const handleVerify = async () => {
    if (otp.length === 4 && !isSubmittingRef.current) {
      isSubmittingRef.current = true;
      setIsLoading(true);
      try {
        const response = await authService.verifyOTP(phoneNumber, otp);
        const { token, driver } = response.data;
        setAuth(token, driver);

        notificationService.requestUserPermission().then(async (hasPermission) => {
          if (hasPermission) {
            const fcmToken = await notificationService.getFCMToken();
            if (fcmToken) {
              await authService.updateFCMToken(fcmToken).catch(console.error);
            }
          }
        }).catch(err => console.log('FCM setup background error:', err));
        
      } catch (error: any) {
        setOtp('');
        const status = error?.response?.status;
        if (status === 403) {
          Alert.alert('Account Not Found', 'Your driver account has not been set up yet. Please contact admin.');
        } else {
          Alert.alert('Invalid OTP', 'The OTP was incorrect or has expired. Please resend and try again.');
        }
      } finally {
        isSubmittingRef.current = false;
        setIsLoading(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      await authService.sendOTP(phoneNumber);
      setTimer(60);
      setOtp('');
      Alert.alert('Success', 'A new OTP has been sent to your phone.');
    } catch (e) {
      Alert.alert('Error', 'Failed to resend OTP.');
    }
  };

  // Render exactly 4 circles representing the OTP
  const renderOtpDisplay = () => {
    return (
      <View style={styles.otpDisplayContainer}>
        {[0, 1, 2, 3].map((index) => {
          const char = otp[index];
          return (
            <View key={index} style={[styles.otpCircle, char ? styles.otpCircleActive : null]}>
              {char ? (
                <Typography variant="h2" color="#0F172A">{char}</Typography>
              ) : (
                <View style={styles.otpDot} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#0F172A" />
        </TouchableOpacity>

        <Typography variant="h1" color="#0F172A" style={styles.title}>
          Verify your number
        </Typography>
        <Typography variant="body" color="#475569" style={styles.subtitle}>
          Enter the 4-digit code sent to <Typography variant="body" bold color="#0F172A">+91 {phoneNumber}</Typography>
        </Typography>

        {/* OTP Circles Display */}
        {renderOtpDisplay()}

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Typography variant="body" color="#64748B" style={{ marginBottom: 8 }}>
            Didn't receive code?
          </Typography>
          <TouchableOpacity 
            style={styles.resendPill} 
            onPress={timer === 0 ? handleResend : undefined}
            disabled={timer > 0}
          >
            <Typography variant="caption" bold color={timer > 0 ? "#94A3B8" : COLORS.primary}>
              RESEND CODE
            </Typography>
            {timer > 0 && (
              <Typography variant="caption" color="#64748B" style={styles.timerText}>
                ⊙ 00:{timer.toString().padStart(2, '0')}
              </Typography>
            )}
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <Button 
          label="VERIFY & CONTINUE" 
          variant="primary"
          size="lg"
          onPress={handleVerify}
          disabled={otp.length !== 4 || isLoading}
          loading={isLoading}
          style={styles.verifyBtn}
        />
      </View>

      {/* Custom Numpad */}
      <View style={styles.numpadContainer}>
        {NUMPAD.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numpadRow}>
            {row.map((key) => {
              if (key === '') {
                return <View key="empty" style={styles.numpadKey} />;
              }
              return (
                <TouchableOpacity 
                  key={key} 
                  style={styles.numpadKey}
                  onPress={() => handleKeyPress(key)}
                  activeOpacity={0.6}
                >
                  {key === 'delete' ? (
                    <Delete size={24} color="#0F172A" />
                  ) : (
                    <Typography variant="h2" color="#0F172A">{key}</Typography>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Very light grey/white background
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    flex: 1,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    marginBottom: SPACING.xs,
    fontSize: 28,
  },
  subtitle: {
    marginBottom: SPACING.xxxl,
    fontSize: 16,
    lineHeight: 24,
  },
  otpDisplayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  otpCircle: {
    width: (width - SPACING.xl * 2 - SPACING.md * 3) / 4,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCircleActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  otpDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  resendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    marginLeft: SPACING.sm,
  },
  verifyBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 30,
    width: '100%',
  },
  numpadContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  numpadKey: {
    width: '30%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
