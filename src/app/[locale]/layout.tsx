import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { LanguageProvider } from "@/src/lib/useLanguage";
import Navbar from "@/src/components/Navbar";
import DebugPanel from "@/src/components/debug/DebugPanel";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LanguageProvider>
        {/*
          Set lang attribute on the wrapper so :lang(th) CSS selector
          activates IBM Plex Sans Thai automatically for Thai content.
        */}
        <div lang={locale}>
          <Navbar />
          <main>{children}</main>
        </div>
      </LanguageProvider>
      <DebugPanel />
    </NextIntlClientProvider>
  );
}
