import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { GradientButton } from '@components/GradientButton';
import { InputField } from '@components/InputField';
import { BorderRadius, Colors, Gradients, Shadows, Spacing, Typography } from '@constants/theme';
import { ScreenName } from '@constants/ScreenNames';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuth } from '@hooks/useAuth';

export function SignupScreen() {
  const navigation = useNavigation<NavigationProp<Record<ScreenName, unknown>>>();
  const { signup, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});

  // Floating icon animation
  const [floatAnim] = React.useState(() => new Animated.Value(0));
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatAnim]);

  const validate = (): boolean => {
    const newErrors: {
      email?: string;
      username?: string;
      password?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = 'Only letters, numbers, and underscores';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    Keyboard.dismiss();
    await signup(email, username, password);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.background} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo / Brand Icon */}
            <Animated.View
              style={[styles.iconContainer, { transform: [{ translateY: floatAnim }] }]}
            >
              <LinearGradient
                colors={['rgba(0, 212, 170, 0.15)', 'rgba(0, 153, 204, 0.08)']}
                style={styles.iconGradient}
              >
                <Text style={styles.iconText}>👤</Text>
                <View style={styles.plusBadge}>
                  <Text style={styles.plusText}>+</Text>
                </View>
              </LinearGradient>
              {/* Glow ring */}
              <View style={styles.glowRing} />
            </Animated.View>

            {/* Title */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the premium shopping experience</Text>

            {/* Form */}
            <View style={styles.form}>
              <InputField
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
              />

              <InputField
                label="Username"
                value={username}
                onChangeText={setUsername}
                error={errors.username}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
              />

              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textContentType="newPassword"
                rightIcon={<Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🔒'}</Text>}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

              <View style={styles.buttonContainer}>
                <GradientButton
                  title="Create Account"
                  onPress={handleSignup}
                  loading={isLoading}
                  disabled={isLoading}
                  size="lg"
                />
              </View>
            </View>

            {/* Bottom Link */}
            <View style={styles.bottomLink}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <Pressable onPress={() => navigation.navigate(ScreenName.Login)}>
                <Text style={styles.linkText}>Login</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxl,
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: Spacing.xxl,
    position: 'relative',
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 212, 170, 0.3)',
  },
  iconText: {
    fontSize: 44,
  },
  plusBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: Typography.bold,
    marginTop: -1,
  },
  glowRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 170, 0.12)',
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  form: {
    width: '100%',
  },
  eyeIcon: {
    fontSize: 20,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
    ...Shadows.primary,
  },
  bottomLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  bottomText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
  linkText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
  },
});
