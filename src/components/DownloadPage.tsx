import { useEffect, useState } from 'react';

const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.gameonfitness.app';
const IOS_APP_URL = 'https://apps.apple.com/app/id6773751865';
const DESKTOP_URL = 'https://gameonfitness.in/';
const DOWNLOAD_PAGE_URL = 'https://gameonfitness.in/download';
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(DOWNLOAD_PAGE_URL)}`;

type TargetPlatform = 'android' | 'ios' | 'desktop' | 'unknown';

type TargetConfig = {
  platform: TargetPlatform;
  label: string;
  url: string;
};

const getTargetConfig = (userAgent: string): TargetConfig => {
  const normalizedAgent = userAgent.toLowerCase();

  if (/android/.test(normalizedAgent)) {
    return {
      platform: 'android',
      label: 'Google Play Store',
      url: ANDROID_APP_URL,
    };
  }

  if (/ipad|iphone|ipod/.test(normalizedAgent)) {
    return {
      platform: 'ios',
      label: 'App Store',
      url: IOS_APP_URL,
    };
  }

  return {
    platform: 'desktop',
    label: 'Game On Fitness website',
    url: DESKTOP_URL,
  };
};

export default function DownloadPage() {
  const [redirectUrl, setRedirectUrl] = useState<string>(DESKTOP_URL);
  const [platformLabel, setPlatformLabel] = useState<string>('device');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const config = getTargetConfig(navigator.userAgent || navigator.vendor || '');
    setRedirectUrl(config.url);
    setPlatformLabel(config.label);

    const timer = window.setTimeout(() => {
      window.location.replace(config.url);
    }, 850);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/30 p-8">
        <div className="flex flex-col gap-6 text-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#00d4ff]">Game On Fitness</p>
            <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-white">
              Redirecting to the right app experience
            </h1>
            <p className="mt-4 text-sm text-white/70 md:text-base">
              We detected your device and are forwarding you to the best destination.
              If the redirect does not happen automatically, use the manual button below.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl shadow-cyan-500/10">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70 mb-4">Detected target</p>
            <p className="text-2xl font-semibold text-white mb-2">{platformLabel}</p>
            <p className="text-sm text-white/60 break-words">{redirectUrl}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_auto] items-center">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-left">
              <p className="text-sm text-white/60 mb-3">Scan this QR code from any other device to open the download redirect page:</p>
              <div className="mx-auto w-full max-w-[250px] overflow-hidden rounded-3xl border border-white/10 bg-white p-3">
                <img
                  src={QR_CODE_URL}
                  alt="QR code for Game On Fitness download page"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-xs text-white/50">QR target: {DOWNLOAD_PAGE_URL}</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-3xl bg-[#111827] p-5 text-left">
                <p className="text-sm font-semibold text-white/80">If the redirect is delayed</p>
                <p className="mt-2 text-xs text-white/60 leading-relaxed">
                  You can open the destination manually below, or scan the QR code from another device.
                </p>
              </div>
              <a
                href={redirectUrl}
                className="inline-flex items-center justify-center rounded-3xl bg-[#00d4ff] px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-[#00b8e6]"
                rel="noreferrer"
              >
                Open {platformLabel}
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p>Loading... Redirecting in a few moments.</p>
          </div>

          <p className="text-xs text-white/40">
            Note: if your device is not recognized, we will send you to the main website.
          </p>
        </div>
      </div>
    </div>
  );
}
