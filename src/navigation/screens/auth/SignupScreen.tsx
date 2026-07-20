import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import { Animated, Keyboard, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { GradientButton, InputField } from "@components/ui";
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
import { resetRoot } from "@utils";
import { useAuth } from "@hooks";
import { useFormik } from "formik";
import * as Yup from "yup";

export function SignupScreen() {
  const { t } = useTranslation();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Floating icon animation
  const [floatAnim] = React.useState(() => new Animated.Value(0));
  useEffect(() => {
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

  // Yup validation schema
  const signupSchema = useMemo(() => {
    return Yup.object().shape({
      email: Yup.string().trim().required(t("emailRequired")).email(t("emailInvalid")),
      username: Yup.string()
        .trim()
        .required(t("usernameRequired"))
        .min(3, t("usernameMinLength"))
        .matches(/^[a-zA-Z0-9_]+$/, t("usernameInvalid")),
      password: Yup.string().required(t("passwordRequired")).min(6, t("passwordMinLength")),
    });
  }, [t]);

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      Keyboard.dismiss();
      await signup(values.email, values.username, values.password);
    },
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Gradients.background} style={StyleSheet.absoluteFill} />
      <KeyboardAwareScrollView
        bottomOffset={15}
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Logo / Brand Icon */}
        <Animated.View style={[styles.iconContainer, { transform: [{ translateY: floatAnim }] }]}>
          <LinearGradient
            colors={["rgba(0, 212, 170, 0.15)", "rgba(0, 153, 204, 0.08)"]}
            style={styles.iconGradient}>
            <Ionicons name="person" size={44} color={Colors.primary} />
            <View style={styles.plusBadge}>
              <Text style={styles.plusText}>+</Text>
            </View>
          </LinearGradient>
          {/* Glow ring */}
          <View style={styles.glowRing} />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>{t("createAccount")}</Text>
        <Text style={styles.subtitle}>{t("joinExperience")}</Text>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label={t("email")}
            placeholder={t("emailPlaceholder")}
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            error={formik.touched.email ? formik.errors.email : undefined}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />

          <InputField
            label={t("username")}
            placeholder={t("usernamePlaceholder")}
            value={formik.values.username}
            onChangeText={formik.handleChange("username")}
            onBlur={formik.handleBlur("username")}
            error={formik.touched.username ? formik.errors.username : undefined}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
          />

          <InputField
            label={t("password")}
            placeholder={t("passwordPlaceholder")}
            value={formik.values.password}
            onChangeText={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
            error={formik.touched.password ? formik.errors.password : undefined}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            textContentType="newPassword"
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
              title={t("createAccount")}
              onPress={formik.handleSubmit as any}
              loading={isLoading}
              disabled={isLoading}
              size="lg"
            />
          </View>
        </View>

        {/* Bottom Link */}
        <View style={styles.bottomLink}>
          <Text style={styles.bottomText}>{t("haveAccountPrompt")} </Text>
          <Pressable onPress={() => resetRoot(ScreenName.Login)}>
            <Text style={styles.linkText}>{t("login")}</Text>
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
    paddingTop: Spacing.xxxl,
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
  plusBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: Colors.textInverse,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: FontFamily.Bold,
    marginTop: -1,
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
    lineHeight: Typography.lineHeightXxxl,
    fontFamily: FontFamily.Bold,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    lineHeight: Typography.lineHeightBase,
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
    lineHeight: Typography.lineHeightSm,
    fontFamily: FontFamily.Regular,
  },
  linkText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    lineHeight: Typography.lineHeightSm,
    fontFamily: FontFamily.Bold,
  },
});
