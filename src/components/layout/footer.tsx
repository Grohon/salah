export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <p>
          Salah &copy; {new Date().getFullYear()} &mdash; Prayer Times, Qibla &amp; Islamic Calendar
          times for every location
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Prayer times are calculated using the Aladhan API. Times may vary
          based on your selected calculation method.
        </p>
      </div>
    </footer>
  );
}
