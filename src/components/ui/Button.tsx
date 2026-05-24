import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from 'react-native';

import { colors } from '@/constants/theme';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type Props = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary/30 border border-primary/50',
  secondary: 'border border-border bg-surface-elevated',
  ghost: 'bg-transparent',
};

const labelStyles: Record<ButtonVariant, string> = {
  primary: 'text-indigo-200 font-semibold',
  secondary: 'text-slate-200 font-medium',
  ghost: 'text-muted font-medium',
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={cn(
        'h-12 flex-row items-center justify-center rounded-xl px-5',
        variantStyles[variant],
        isDisabled && 'opacity-50',
        className,
      )}
      disabled={isDisabled}
      {...props}>
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <Text className={labelStyles[variant]}>{label}</Text>
      )}
    </Pressable>
  );
}
