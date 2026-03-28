import React, { useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search recipes...',
  autoFocus = false,
  onFocus,
  onBlur,
}) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.01,
      useNativeDriver: true,
      tension: 100,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
    }).start();
    onBlur?.();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        theme.shadow.sm,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={theme.colors.textMuted}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, { color: theme.colors.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoFocus={autoFocus}
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
        autoCapitalize="none"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={onClear} hitSlop={8}>
          <View style={[styles.clearBtn, { backgroundColor: theme.colors.textMuted }]}>
            <Ionicons name="close" size={12} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  clearBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
