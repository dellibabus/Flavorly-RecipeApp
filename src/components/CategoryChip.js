import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function CategoryChip({
  label,
  imageUri,
  selected = false,
  onPress,
}) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
        !selected && theme.shadow.sm,
      ]}
    >
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.chipImage} />
      )}
      <Text
        style={[
          styles.label,
          {
            color: selected ? '#fff' : theme.colors.textSecondary,
            fontWeight: selected ? '700' : '500',
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    gap: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  chipImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 13,
  },
});
