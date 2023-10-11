export default function PageLoader({ loaderMessage }: { loaderMessage: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex min-h-[150px] w-full flex-col items-center justify-center p-4 pt-5 text-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-green-600"></div>
        <p className="mt-4 text-lg font-medium" aria-live="polite" aria-atomic="true">
          {loaderMessage}
        </p>
      </div>
    </div>
  );
}
