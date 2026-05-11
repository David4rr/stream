export function EmptyStateIcon() {
  return (
    <svg
      className="w-7 h-7 lg:w-10 lg:h-10 text-gray-400 dark:text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
      />
    </svg>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 lg:py-24 text-center">
      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mb-4 lg:mb-6">
        <EmptyStateIcon />
      </div>
      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
        {description}
      </p>
    </div>
  );
}
