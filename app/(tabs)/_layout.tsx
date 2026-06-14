import { useEffect } from 'react';
import { Text } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useSettings } from '../../src/context/SettingsContext';
import { COLORS, FONT } from '../../src/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const router = useRouter();
  const { settings, ready } = useSettings();

  // First-run gate — applies whichever tab loads first.
  useEffect(() => {
    if (ready && !settings.onboarded) router.replace('/onboarding');
  }, [ready, settings.onboarded, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inkFaint,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: { fontFamily: FONT.semibold, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Path', tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} /> }}
      />
      <Tabs.Screen
        name="sets"
        options={{ title: 'Sets', tabBarIcon: ({ focused }) => <TabIcon emoji="🃏" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
    </Tabs>
  );
}
