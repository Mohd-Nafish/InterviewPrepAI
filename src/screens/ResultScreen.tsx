import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ResultHeader, ResultSectionCard } from '@/components/result';
import { Button, FadeIn, ScreenContainer, ScreenNavBar, Text } from '@/components/ui';
import { getTotalItemCount, RESULT_SECTIONS } from '@/constants/resultSections';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export function ResultScreen({ navigation, route }: Props) {
  const { result, notice } = route.params;
  const totalItems = getTotalItemCount(result);

  return (
    <ScreenContainer scroll contentClassName="pb-12">
      <FadeIn index={0}>
        <ScreenNavBar onBack={() => navigation.goBack()} />
      </FadeIn>

      {notice ? (
        <FadeIn index={1} className="mt-5">
          <View className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3.5">
            <Text variant="caption" className="leading-6 text-amber-100/90">
              {notice}
            </Text>
          </View>
        </FadeIn>
      ) : null}

      <FadeIn index={notice ? 2 : 1} className="mt-5">
        <ResultHeader result={result} totalItems={totalItems} />
      </FadeIn>

      <View className="mt-8 gap-5">
        {RESULT_SECTIONS.map((section, index) => (
          <FadeIn key={section.key} index={index + (notice ? 3 : 2)}>
            <ResultSectionCard section={section} items={result[section.key]} />
          </FadeIn>
        ))}
      </View>

      <FadeIn index={RESULT_SECTIONS.length + (notice ? 4 : 3)} className="mt-10">
        <Button label="Generate another plan" variant="ghost" onPress={() => navigation.popToTop()} />
      </FadeIn>
    </ScreenContainer>
  );
}
