import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Animated, Keyboard, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GradientButton, InputField } from "@components";
import {
  BorderRadius,
  Colors,
  Gradients,
  Shadows,
  Spacing,
  Typography,
  ScreenName,
  FontFamily,
} from "@constants";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "@hooks";

export function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<Record<ScreenName, unknown>>>();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = t("emailInvalid");
    }

    if (!password) {
      newErrors.password = t("passwordRequired");
    } else if (password.length < 6) {
      newErrors.password = t("passwordMinLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    Keyboard.dismiss();
    await login(email, password);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.background} style={StyleSheet.absoluteFill} />
      <KeyboardAwareScrollView
        style={styles.flex}
        bottomOffset={15}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.iconContainer, { transform: [{ translateY: floatAnim }] }]}>
          <LinearGradient
            colors={["rgba(0, 212, 170, 0.15)", "rgba(0, 153, 204, 0.08)"]}
            style={styles.iconGradient}>
            <Ionicons name="bag-handle" size={44} color={Colors.primary} />
          </LinearGradient>
          <View style={styles.glowRing} />
        </Animated.View>

        <Text style={styles.title}>{t("welcomeBack")}</Text>
        <Text style={styles.subtitle}>{t("signInContinue")}</Text>

        <View style={styles.form}>
          <InputField
            placeholder={t("emailPlaceholder")}
            label={t("email")}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />

          <InputField
            placeholder={t("passwordPlaceholder")}
            label={t("password")}
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            textContentType="password"
            rightIcon={
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color={Colors.textSecondary}
              />
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <View style={styles.buttonContainer}>
            <GradientButton
              title={t("signIn")}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              size="lg"
            />
          </View>
        </View>

        {/* Bottom Link */}
        <View style={styles.bottomLink}>
          <Text style={styles.bottomText}>{t("noAccountPrompt")} </Text>
          <Pressable onPress={() => navigation.navigate(ScreenName.Signup)}>
            <Text style={styles.linkText}>{t("signUp")}</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
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
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.giant,
    paddingBottom: Spacing.xxl,
  },
  iconContainer: {
    alignSelf: "center",
    marginBottom: Spacing.xxl,
    position: "relative",
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 212, 170, 0.3)",
  },
  glowRing: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(0, 212, 170, 0.12)",
  },
  title: {
    fontSize: Typography.xxxl,
    fontFamily: FontFamily.Bold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontFamily: FontFamily.Regular,
    textAlign: "center",
    marginBottom: Spacing.xxxl,
  },
  form: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: Spacing.lg,
    ...Shadows.primary,
  },
  bottomLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xxxl,
  },
  bottomText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    fontFamily: FontFamily.Regular,
  },
  linkText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontFamily: FontFamily.Bold,
  },
});
