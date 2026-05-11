// Shared auth button styles
export const authButtonStyles = {
  primary: "rounded-2xl bg-[#3477d7] hover:bg-[#2868c5] active:bg-[#1e4f94] text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border-0 shadow-[0_4px_20px_rgba(139,120,255,0.5),0_2px_8px_rgba(84,81,214,0.3)] hover:shadow-[0_6px_25px_rgba(139,120,255,0.6),0_3px_12px_rgba(84,81,214,0.4)]",
  social: "flex-1 h-9 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 transition-opacity hover:opacity-80 active:opacity-60",
  link: "font-semibold text-[#5451d6] dark:text-blue-400 hover:underline hover:underline-offset-2 transition-all h-auto p-0 inline-flex items-center",
} as const;
