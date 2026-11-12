import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TaskProvider } from '@/context/TaskContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function RootNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
          },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(drawer)"
          options={{
            title: 'TaskFlow',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="task/new"
          options={{
            title: 'New Task',
            presentation: 'card',
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Stack.Screen
          name="task/[id]"
          options={{
            title: 'Edit Task',
            presentation: 'card',
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TaskProvider>
          <RootNavigator />
        </TaskProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
