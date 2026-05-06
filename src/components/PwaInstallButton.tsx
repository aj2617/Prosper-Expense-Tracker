import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canInstall = useMemo(
    () => !installed && !isStandalone && Boolean(deferredPrompt),
    [installed, isStandalone, deferredPrompt],
  );

  const handleInstall = async () => {
    if (!deferredPrompt) {
      window.alert("To install: open browser menu and choose 'Install app' or 'Add to Home Screen'.");
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <button
      type="button"
      onClick={handleInstall}
      disabled={installed || isStandalone}
      className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      title={
        installed || isStandalone
          ? "App already installed"
          : canInstall
            ? "Install this app"
            : "Open browser menu and choose Install app / Add to Home Screen"
      }
    >
      <Download className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{installed || isStandalone ? "App Installed" : "Download App"}</span>
    </button>
  );
}
