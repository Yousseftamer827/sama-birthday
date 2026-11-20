export interface MemoryItem {
  id: string;
  label: string;
}

export const BIRTHDAY_CONFIG = {
  recipientName: "Sama",
  passcode: "2111",
  wrongPasscodeMessage: "Try again.. your birthday is 21/11 ✨",
  welcomeGreeting: "Sama",
  welcomeSubtitle: "happy birthday 21❤️🥳",
  enterButtonLabel: "Enter the Night Sky ✨",
  connectInstruction: "Click on the stars to connect them ✨",
  cakeCaption: "Make a wish, Sama ✨",
  openLetterLabel: "Open the Letter ✉️",
  backToStarsLabel: "Back to the stars",
  letterTitle: "For Sama",
  letterBody:
    "كل سنه وانتي طيبه ي سما و عقبال العمر كله تكوني بخير و سعاده و تحققي كل اللي بتتمنيه و يارب ايامك تبقي كلها سعاده و راحه بال 🥳🎉🎉🎂🎂❤️❤️",
};

export const MEMORY_IDS = ["01", "02", "03", "04"] as const;

export const MEMORIES: MemoryItem[] = [
  { id: "01", label: "Memory 1 of 4" },
  { id: "02", label: "Memory 2 of 4" },
  { id: "03", label: "Memory 3 of 4" },
  { id: "04", label: "Memory 4 of 4" },
];

export function getContent() {
  return {
    ...BIRTHDAY_CONFIG,
    name: BIRTHDAY_CONFIG.recipientName,
    memories: MEMORIES,
    memoryIds: MEMORY_IDS,
  };
}