import { KeyboardAvoidingView, Platform, ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackgroundGlow } from '@/components/ui/BackgroundGlow';
import { cn } from '@/utils/cn';

type Props = ViewProps & {
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  contentClassName?: string;
};

export function ScreenContainer({
  scroll = false,
  keyboardAvoiding = false,
  className,
  contentClassName,
  children,
  ...props
}: Props) {
  const body = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={cn('px-5 pb-12', contentClassName)}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...props}>
      {children}
    </ScrollView>
  ) : (
    <View className={cn('flex-1 px-5', contentClassName)} {...props}>
      {children}
    </View>
  );

  const content =
    keyboardAvoiding && scroll ? (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        {body}
      </KeyboardAvoidingView>
    ) : (
      body
    );

  return (
    <View className="flex-1 bg-background">
      <BackgroundGlow />
      <SafeAreaView className="flex-1">{content}</SafeAreaView>
    </View>
  );
}
