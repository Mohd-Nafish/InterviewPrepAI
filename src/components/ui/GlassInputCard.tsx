import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { GlowCard } from '@/components/ui/GlowCard';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/theme';
import { cn } from '@/utils/cn';

type Props = TextInputProps & {
  label: string;
  charCount: number;
  maxChars?: number;
  hint?: string;
};

export function GlassInputCard({
  label,
  charCount,
  maxChars = 3000,
  hint,
  className,
  onFocus,
  onBlur,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <GlowCard
      glowColor={focused ? colors.primary : undefined}
      intensity={focused ? 'high' : 'medium'}
      noPadding
      className={className}>
      <View className="px-5 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="document-text-outline" size={18} color={colors.textMuted} />
            <Text variant="label" className="text-accent">
              {label}
            </Text>
          </View>
          <Text variant="caption" className="text-muted">
            {charCount} / {maxChars}
          </Text>
        </View>

        <TextInput
          className={cn(
            'mt-4 min-h-[180px] rounded-xl border px-4 py-3.5 text-base leading-6 text-accent',
            focused ? 'border-border-glow bg-background-elevated' : 'border-border bg-background/60',
          )}
          placeholderTextColor={colors.textMuted}
          textAlignVertical="top"
          multiline
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />

        {hint ? (
          <Text variant="caption" className="mt-3 text-muted">
            {hint}
          </Text>
        ) : null}

        <View className="mt-3 flex-row justify-end">
          <Ionicons name="create-outline" size={16} color={colors.textMuted} />
        </View>
      </View>
    </GlowCard>
  );
}
