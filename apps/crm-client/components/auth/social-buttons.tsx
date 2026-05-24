"use client";

import { Button } from "@/components/ui/button";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function BinanceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L6.5 6.5 8.38 8.38 12 4.76l3.62 3.62L17.5 6.5zM1 12l1.88-1.88L4.76 12l-1.88 1.88zm5.5 0l1.88-1.88L10.26 12l-1.88 1.88zm3.62 0L12 10.12 13.88 12 12 13.88zM13.74 12l1.88-1.88L17.5 12l-1.88 1.88zm3.5 0l1.88-1.88L21 12l-1.88 1.88zM12 19.24l-3.62-3.62L6.5 17.5 12 23l5.5-5.5-1.88-1.88z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

const providers = [
  { name: "Google", icon: GoogleIcon },
  { name: "Apple", icon: AppleIcon },
  { name: "Binance", icon: BinanceIcon },
  { name: "Wallet", icon: WalletIcon },
] as const;

export function SocialButtons() {
  return (
    <div className="flex flex-col gap-2.5">
      {providers.map(({ name, icon: Icon }) => (
        <Button
          key={name}
          variant="outline"
          size="lg"
          className="h-11 w-full cursor-pointer justify-center gap-2.5 rounded-lg border-border/60 text-sm font-medium transition-all duration-200 hover:border-border hover:bg-muted/50"
        >
          <Icon />
          Continue with {name}
        </Button>
      ))}
    </div>
  );
}
