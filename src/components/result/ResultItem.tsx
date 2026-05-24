import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/ui';
import { gradients } from '@/constants/theme';
import { cn } from '@/utils/cn';

type Props = {
  index: number;
  text: string;
  isLast?: boolean;
  accent?: keyof typeof gradients;
};

export function ResultItem({ index, text, isLast = false, accent = 'primary' }: Props) {
  const gradientColors = gradients[accent] ?? gradients.primary;

  return (
    <View className={cn('flex-row gap-3.5 py-4', !isLast && 'border-b border-border/40')}>
      <LinearGradient
        colors={[...gradientColors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 30,
          height: 30,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        }}>
        <Text variant="caption" className="text-xs font-bold text-white">
          {index}
        </Text>
      </LinearGradient>
      <Text variant="body" className="flex-1 leading-7">
        {text}
      </Text>
    </View>
  );
}
