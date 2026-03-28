import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  rightIcon,
  onRightPress,
  transparent = false,
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + 8,
          backgroundColor: transparent ? 'transparent' : theme.colors.background,
          borderBottomColor: transparent ? 'transparent' : theme.colors.border,
          borderBottomWidth: transparent ? 0 : 0.5,
        },
      ]}
    >
      <View style={styles.row}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          {title && (
            <Text
              style={[styles.title, { color: theme.colors.textPrimary }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>

        {(rightAction || rightIcon) && (
          <TouchableOpacity onPress={onRightPress} style={styles.rightBtn} hitSlop={8}>
            {rightAction || (
              <Ionicons name={rightIcon} size={22} color={theme.colors.textPrimary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  backBtn: {
    marginRight: 8,
    padding: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 1,
  },
  rightBtn: {
    padding: 2,
  },
});
