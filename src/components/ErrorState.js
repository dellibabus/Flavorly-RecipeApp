import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export default function ErrorState({ message, onRetry }) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.error + '18' }]}>
        <Ionicons name="cloud-offline-outline" size={48} color={theme.colors.error} />
      </View>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Oops!</Text>
      <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
        {message || 'Something went wrong. Please try again.'}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: theme.colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh" size={16} color="#fff" />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
