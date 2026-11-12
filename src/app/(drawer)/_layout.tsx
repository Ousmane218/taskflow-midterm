import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import {
  Drawer,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from 'expo-router/drawer';
import { DrawerActions } from 'expo-router/react-navigation';
import {
  CheckSquare,
  Info,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ICON_SIZE, ICON_STROKE, RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

function DrawerMenuButton() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Open navigation menu"
      style={styles.menuButton}
    >
      <Menu
        size={ICON_SIZE.lg}
        color={colors.textPrimary}
        strokeWidth={ICON_STROKE}
      />
    </Pressable>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.drawerContainer,
        {
          backgroundColor: colors.surface,
          paddingTop: insets.top,
        },
      ]}
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScrollContent}
      >
        {/* Drawer Header */}
        <View
          style={[
            styles.drawerHeader,
            { borderBottomColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.logoBadge,
              { backgroundColor: colors.primaryMuted },
            ]}
          >
            <CheckSquare
              size={ICON_SIZE.lg}
              color={colors.primary}
              strokeWidth={ICON_STROKE}
            />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.appName, { color: colors.textPrimary }]}>
              TaskFlow
            </Text>
            <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
              Personal task manager
            </Text>
          </View>
        </View>

        {/* Navigation Links */}
        <View style={styles.navSection}>
          <DrawerItemList {...props} />
        </View>

        {/* Preferences Section */}
        <View
          style={[
            styles.preferencesSection,
            { borderTopColor: colors.border },
          ]}
        >
          <Text
            style={[styles.sectionLabel, { color: colors.textSecondary }]}
          >
            Preferences
          </Text>
          <View style={styles.themeRow}>
            <View style={styles.themeLabelGroup}>
              <Moon
                size={ICON_SIZE.md}
                color={colors.textSecondary}
                strokeWidth={ICON_STROKE}
              />
              <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              accessibilityLabel="Toggle Dark Mode"
              trackColor={{ false: colors.border, true: colors.primary }}
              ios_backgroundColor={colors.border}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View
        style={[
          styles.drawerFooter,
          {
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, SPACING.md),
          },
        ]}
      >
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          TaskFlow v1.0.0
        </Text>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
        headerLeft: () => <DrawerMenuButton />,
        drawerStyle: {
          backgroundColor: colors.surface,
          width: 280,
        },
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: colors.primaryMuted,
        drawerInactiveTintColor: colors.textSecondary,
        drawerItemStyle: {
          borderRadius: RADIUS.button,
          marginHorizontal: 8,
          marginVertical: 2,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Main Tabs',
          title: 'TaskFlow',
          headerShown: false,
          drawerIcon: ({ color }) => (
            <LayoutDashboard
              size={ICON_SIZE.md}
              color={color}
              strokeWidth={ICON_STROKE}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color }) => (
            <Settings
              size={ICON_SIZE.md}
              color={color}
              strokeWidth={ICON_STROKE}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: 'About',
          title: 'About',
          drawerIcon: ({ color }) => (
            <Info
              size={ICON_SIZE.md}
              color={color}
              strokeWidth={ICON_STROKE}
            />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    padding: 4,
  },
  drawerContainer: {
    flex: 1,
  },
  drawerScrollContent: {
    paddingTop: 0,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextGroup: {
    flex: 1,
    gap: 2,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
  },
  appSubtitle: {
    fontSize: 13,
  },
  navSection: {
    paddingVertical: SPACING.sm,
  },
  preferencesSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: SPACING.xs,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  themeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  drawerFooter: {
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
