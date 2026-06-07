import { useEffect } from 'react';

const ANDROID_APP_URL =
  'https://play.google.com/store/apps/details?id=com.gameonfitness.app';

const IOS_APP_URL =
  'https://apps.apple.com/app/id6773751865';

const WEBSITE_URL =
  'https://gameonfitness.in';

export default function DownloadPage() {
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    let redirectUrl = WEBSITE_URL;

    if (ua.includes('android')) {
      redirectUrl = ANDROID_APP_URL;
    } else if (
      ua.includes('iphone') ||
      ua.includes('ipad') ||
      ua.includes('ipod')
    ) {
      redirectUrl = IOS_APP_URL;
    }

    setTimeout(() => {
      window.location.replace(redirectUrl);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500 flex items-center justify-center">
            <span className="text-black font-black text-xl">GO</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">
          Game On Fitness
        </h1>

        <p className="text-white/70 mb-6">
          Redirecting you to the correct app store...
        </p>

        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <p className="text-xs text-white/40 mt-6">
          If nothing happens, please refresh the page.
        </p>
      </div>
    </div>
  );
}