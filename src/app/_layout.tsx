import "../global.css";
import { Slot, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import Toast from 'react-native-toast-message';
import { WalletProvider } from "@/contexts/WalletContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { toastConfig } from "@/components/ToastConfig";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { LogBox } from 'react-native';

// Suppress all warnings in development only
if (__DEV__) {
  const ignoreLogTextList = [
    "Warning: findNodeHandle is deprecated in StrictMode.",
    "Warning: findHostInstance_DEPRECATED is deprecated in StrictMode.",
  ];

  const connectConsoleTextFromArgs = (arrayOfStrings: string[]): string =>
    arrayOfStrings
      .slice(1)
      .reduce(
        (baseString, currentString) => baseString.replace("%s", currentString),
        arrayOfStrings[0],
      );

  const filterIgnoredMessages =
    (logger): ((...args: any[]) => void) =>
    (...args): void => {
      const output = connectConsoleTextFromArgs(args);

      if (!ignoreLogTextList.some((log) => output.includes(log))) {
        logger(...args);
      }
    };

  console.log = filterIgnoredMessages(console.log);
  console.info = filterIgnoredMessages(console.info);
  console.warn = filterIgnoredMessages(console.warn);
  console.error = filterIgnoredMessages(console.error);
}

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log('=== Layout Debug ===');
    console.log('Pathname:', pathname);
    switch (pathname) {
      case '/onDisconnect':
        router.replace('/LoginScreen');
        break;
      case '/onSignTransaction':
        router.replace('/home/(root)');
        break;
      case '/onSignAndSendTransaction':
        router.replace('/home/(root)/settings');
        break;
      case '/onSignAllTransactions':
        router.replace('/home/(root)/settings');
        break;
      case '/onSignMessage':
        router.replace('/home/(root)/settings');
        break;
    }
  }, [pathname, router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <WalletProvider>
          <Slot />
          <Toast config={toastConfig} />
        </WalletProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}