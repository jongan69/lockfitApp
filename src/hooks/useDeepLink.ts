import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';

export function useDeepLink() {
  const [deepLink, setDeepLink] = useState<string>('');

  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
      }
    })();

    const subscription = Linking.addEventListener('url', ({ url }) => {
      setDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return deepLink;
} 