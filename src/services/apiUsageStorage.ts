import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_API_CALL_KEY = '@interviewprepai/last_api_call_at';

export async function getLastApiCallAt(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(LAST_API_CALL_KEY);
  if (!raw) return null;

  const timestamp = Number(raw);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export async function setLastApiCallAt(timestamp: number = Date.now()): Promise<void> {
  await AsyncStorage.setItem(LAST_API_CALL_KEY, String(timestamp));
}
