import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography, Input, Button } from '../../components';
import { COLORS, SPACING } from '../../theme';
import { authService } from '../../api/authService';

// Define locally since AuthNavigator isn't available in this context for checking
type Props = {
  navigation: any;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phoneNumber.length === 10) {
      setIsLoading(true);
      try {
        await authService.sendOTP(phoneNumber);
        navigation.navigate('OTP', { phoneNumber });
      } catch (error) {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
        console.error('Failed to send OTP:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Typography variant="h1" color={COLORS.white} style={styles.title}>
                AIRPAX
              </Typography>
              <Typography variant="caption" color={COLORS.accent} bold style={styles.badge}>
                DRIVER
              </Typography>
            </View>
            
            <Typography variant="body" color={COLORS.textSecondary} style={styles.subtitle}>
              Enter your mobile number to sign in or create a new driver account.
            </Typography>

            <Input
              placeholder="000 000 0000"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
              prefix={
                <Typography variant="body" color={COLORS.textPrimary} bold>
                  +91
                </Typography>
              }
              containerStyle={styles.inputContainer}
            />

            <Button 
              label="SEND OTP" 
              variant="accent"
              size="lg"
              onPress={handleSendOTP}
              disabled={phoneNumber.length !== 10}
              loading={isLoading}
              style={styles.button}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // Dark navy background
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.sm,
  },
  title: {
    letterSpacing: 2,
    marginRight: SPACING.sm,
  },
  badge: {
    backgroundColor: `${COLORS.accent}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  subtitle: {
    marginBottom: SPACING.xxxl,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: SPACING.xl,
  },
  button: {
    marginTop: 'auto',
    marginBottom: SPACING.xxl,
  },
});
