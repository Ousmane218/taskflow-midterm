import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Tabs, useNavigation } from 'expo-router';
import { DrawerActions } from 'expo-router/react-navigation';
import {
  CircleCheckBig,
  House,
  ListTodo,
  Menu,
} from 'lucide-react-native';
import { ICON_SIZE, ICON_STROKE } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

function HeaderDrawerButton() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Open navigation menu"
      style={styles.headerLeftBtn}
    >
      <Menu
        size={ICON_SIZE.lg}
        color={colors.textPrimary}
        strokeWidth={ICON_STROKE}
      />
    </Pressable>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
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
          fontWeight: '700',
          fontSize: 18,
        },
        headerLeft: () => <HeaderDrawerButton />,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'TaskFlow',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <House
              size={ICON_SIZE.md}
              color={color}
              strokeWidth={ICON_STROKE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color }) => (
            <ListTodo
              size={ICON_SIZE.md}
              color={color}
              strokeWidth={ICON_STROKE}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: 'Completed',
          tabBarLabel: 'Completed',
          tabBarIcon: ({ color }) => (
            <CircleCheckBig
              size={ICON_SIZE.md}
              color={color}
              strokeWidth={ICON_STROKE}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLeftBtn: {
    marginLeft: 16,
    padding: 4,
  },
});
