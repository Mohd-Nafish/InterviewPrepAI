import { useRef, useState } from 'react';
import { ScrollView, Text as RNText, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AIHeroVisual,
  AppHeader,
  Chip,
  FadeIn,
  FeatureCard,
  GlassInputCard,
  GradientButton,
  ScreenContainer,
  Text,
} from '@/components/ui';
import { HOME_FEATURES } from '@/constants/featureCards';
import { ROLE_OPTIONS } from '@/constants/roles';
import { ROLE_ICONS } from '@/constants/roleIcons';
import { colors } from '@/constants/theme';
import { useInterviewPrep } from '@/hooks/useInterviewPrep';
import type { RootStackParamList } from '@/navigation/types';
import type { InterviewRole } from '@/types/interview';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MIN_JOB_DESCRIPTION_LENGTH = 40;

export function HomeScreen({ navigation }: Props) {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedRole, setSelectedRole] = useState<InterviewRole | null>(null);
  const {
    generate,
    loading,
    loadingPhase,
    error,
    clearError,
    isCooldown,
    cooldownRemainingMs,
    isMockMode,
  } = useInterviewPrep();

  const isSubmittingRef = useRef(false);

  const charCount = jobDescription.trim().length;
  const canGenerate = charCount >= MIN_JOB_DESCRIPTION_LENGTH && selectedRole !== null;
  const isBusy = loading;
  const cooldownSeconds = Math.ceil(cooldownRemainingMs / 1000);

  const handleGenerate = async () => {
    if (isBusy) return;

    isSubmittingRef.current = true;
    clearError();

    try {
      const response = await generate(jobDescription, selectedRole);
      if (response) {
        navigation.navigate('Result', {
          result: response.result,
          notice: response.notice,
        });
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const generateLabel = (() => {
    if (loadingPhase === 'checking') return 'Checking cache...';
    if (loadingPhase === 'generating') return 'Generating plan...';
    if (isCooldown) return `Wait ${cooldownSeconds}s`;
    return 'Generate Prep Plan';
  })();

  const isGenerateDisabled = !canGenerate || isBusy || isCooldown;

  const helperText = (() => {
    if (loading) return ' ';
    if (isCooldown) return 'Cooldown active to save API quota. Cached plans load instantly.';
    if (!canGenerate) return 'Paste a job description and select a role to continue';
    return ' ';
  })();

  return (
    <ScreenContainer scroll keyboardAvoiding>
      <FadeIn index={0}>
        <AppHeader
          historyDisabled={isBusy}
          onHistoryPress={() => navigation.navigate('History')}
        />
      </FadeIn>

      {isMockMode ? (
        <FadeIn index={1} className="mt-4">
          <View className="self-start rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5">
            <Text variant="caption" className="text-indigo-200">
              Mock mode — no Gemini API calls
            </Text>
          </View>
        </FadeIn>
      ) : null}

      <FadeIn index={2} className="mt-8">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1 pr-2">
            <Text variant="hero">
              Prepare for your{'\n'}
              <RNText style={{ color: colors.primaryLight }}>next interview</RNText>
            </Text>
            <Text variant="body" className="mt-3 max-w-[280px]">
              Paste a job description, pick your role, and get a tailored AI prep plan.
            </Text>
          </View>
          <AIHeroVisual />
        </View>
      </FadeIn>

      <FadeIn index={3} className="mt-8">
        <GlassInputCard
          label="Job description"
          charCount={charCount}
          editable={!isBusy}
          placeholder="Paste job responsibilities, requirements, and tech stack from the job posting..."
          value={jobDescription}
          onChangeText={(text) => {
            if (error) clearError();
            setJobDescription(text);
          }}
          hint={
            charCount > 0 && charCount < MIN_JOB_DESCRIPTION_LENGTH
              ? `Add more detail for better results (${MIN_JOB_DESCRIPTION_LENGTH}+ characters recommended).`
              : undefined
          }
        />
      </FadeIn>

      <FadeIn index={4} className="mt-8">
        <View className="flex-row items-center gap-2.5">
          <Ionicons name="person-outline" size={18} color={colors.textMuted} />
          <View>
            <Text variant="label">Target role</Text>
            <Text variant="caption">Select the role you are preparing for</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-5"
          contentContainerStyle={{ gap: 10, paddingRight: 16, paddingVertical: 4 }}>
          {ROLE_OPTIONS.map((role) => (
            <Chip
              key={role.value}
              label={role.label}
              icon={ROLE_ICONS[role.value]}
              selected={selectedRole === role.value}
              disabled={isBusy}
              onPress={() => {
                if (error) clearError();
                setSelectedRole((current) => (current === role.value ? null : role.value));
              }}
            />
          ))}
        </ScrollView>
      </FadeIn>

      {error ? (
        <FadeIn index={5} className="mt-5">
          <View className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3">
            <Text className="text-destructive" variant="caption">
              {error}
            </Text>
          </View>
        </FadeIn>
      ) : null}

      <FadeIn index={6} className="mt-6">
        <View className="rounded-2xl border border-border/50 bg-surface/30 px-1 pb-1 pt-1">
          <GradientButton
            label={generateLabel}
            loading={loading}
            disabled={isGenerateDisabled}
            onPress={handleGenerate}
          />
        </View>

        <View className="mt-3 min-h-[44px] items-center justify-center px-4">
          <Text variant="caption" className="text-center leading-5">
            {helperText.trim() ? helperText : ' '}
          </Text>
        </View>
      </FadeIn>

      <FadeIn index={7} className="mt-10">
        <Text variant="label" className="mb-4">
          Your plan includes
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
          {HOME_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </ScrollView>
      </FadeIn>

      <FadeIn index={8} className="mt-8 pb-2">
        <View className="flex-row items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.textMuted} />
          <Text variant="caption">AI-powered • Fast • Accurate • Personalized</Text>
        </View>
      </FadeIn>
    </ScreenContainer>
  );
}
