import React, { useEffect, useState } from "react";
import { I18nManager, View, ActivityIndicator } from "react-native";
import * as Updates from "expo-updates";
import { useAppSelector } from "@store";
import i18n from "@language/i18n";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useAppSelector((state) => state.language.language);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLanguage = async () => {
      // 1. Sync i18next language
      if (i18n.language !== language) {
        await i18n.changeLanguage(language);
      }

      // 2. Check RTL alignment
      const shouldBeRTL = language === "ar";
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);

        // Restart to load new layout configuration
        try {
          await Updates.reloadAsync();
        } catch (e) {
          console.error("Failed to reload app for RTL switch:", e);
        }
      }
      setIsReady(true);
    };

    initLanguage();
  }, [language]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return <>{children}</>;
}
