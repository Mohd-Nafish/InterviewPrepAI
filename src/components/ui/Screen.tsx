import { KeyboardAvoidingView, Platform, ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/utils/cn';

type Props = ViewProps & {
  scroll?: boolean;
  keyboardAvoiding?: boolean;
};

export function Screen({
  scroll = false,
  keyboardAvoiding = false,
  className,
  children,
  ...props
}: Props) {
  const content = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={cn('grow px-5 pb-10', className)}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...props}>
      {children}
    </ScrollView>
  ) : (
    <View className={cn('flex-1 px-5', className)} {...props}>
      {children}
    </View>
  );

  const body =
    keyboardAvoiding && scroll ? (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        {content}
      </KeyboardAvoidingView>
    ) : (
      content
    );

  return <SafeAreaView className="flex-1 bg-background">{body}</SafeAreaView>;
}
