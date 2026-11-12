import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckSquare } from 'lucide-react-native';
import { ICON_SIZE, ICON_STROKE, RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';

const TECHNOLOGIES = [
  'React Native & Expo',
  'TypeScript',
  'Expo Router',
  'React Context API',
  'AsyncStorage',
  'REST API with fetch()',
  'React Native StyleSheet',
  'Lucide Icons',
];

export default function AboutScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Application Introduction */}
      <View style={styles.introSection}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: colors.primaryMuted },
          ]}
        >
          <CheckSquare
            size={ICON_SIZE.xl}
            color={colors.primary}
            strokeWidth={ICON_STROKE}
          />
        </View>
        <Text style={[styles.appName, { color: colors.textPrimary }]}>
          TaskFlow
        </Text>
        <Text style={[styles.version, { color: colors.textSecondary }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          A minimal personal task manager for organizing daily tasks, tracking
          progress, and working reliably offline.
        </Text>
      </View>

      {/* Academic Purpose */}
      <View
        style={[
          styles.sectionBlock,
          { borderTopColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Academic Purpose
        </Text>
        <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
          TaskFlow was created as a university Mobile Development midterm
          project demonstrating Expo Router navigation, React Context state
          management, light and dark themes, local storage, and REST API
          integration.
        </Text>
      </View>

      {/* Technologies */}
      <View
        style={[
          styles.sectionBlock,
          { borderTopColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Technologies
        </Text>
        <View
          style={[
            styles.techList,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {TECHNOLOGIES.map((tech, index) => (
            <View
              key={tech}
              style={[
                styles.techRow,
                index < TECHNOLOGIES.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.techItem, { color: colors.textPrimary }]}>
                {tech}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.xl,
    paddingBottom: 36,
  },
  introSection: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: 4,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
  },
  version: {
    fontSize: 13,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: SPACING.xs,
    maxWidth: 320,
  },
  sectionBlock: {
    paddingTop: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
  },
  techList: {
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  techRow: {
    paddingVertical: 11,
    paddingHorizontal: SPACING.md,
  },
  techItem: {
    fontSize: 14,
    fontWeight: '500',
  },
});
