import { useEffect } from 'react';

const ANDROID_APP_URL =
  'https://play.google.com/store/apps/details?id=com.gameonfitness.app';

const IOS_APP_URL = 'https://apps.apple.com/app/id6773751865';

const WEBSITE_URL = 'https://gameonfitness.in';

export default function DownloadPage() {
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    let redirectUrl = WEBSITE_URL;

    if (ua.includes('android')) {
      redirectUrl = ANDROID_APP_URL;
    } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      redirectUrl = IOS_APP_URL;
    }

    setTimeout(() => {
      window.location.replace(redirectUrl);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen atmosphere flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-[rgba(18,20,26,0.08)] bg-white p-8 text-center shadow-[0_28px_60px_rgba(18,20,26,0.08)]">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#16181f] flex items-center justify-center">
            <span className="text-white font-display font-bold text-xl">GO</span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-extrabold text-[#16181f] mb-3">
          Game On Fitness
        </h1>

        <p className="text-[#6f7685] mb-6">Redirecting you to the correct app store...</p>

        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-[#e07a72] border-t-transparent rounded-full animate-spin" />
        </div>

        <p className="text-xs text-[#9aa0ab] mt-6">
          If nothing happens, please refresh the page.
        </p>
      </div>
    </div>
  );
}
