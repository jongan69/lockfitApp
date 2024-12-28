import { Redirect, useGlobalSearchParams } from 'expo-router';
import { useWallet } from '@/contexts/WalletContext';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

export default function OnConnect() {
  const params = useGlobalSearchParams();
  const { handleConnectResponse } = useWallet();

  useEffect(() => {
    console.log('=== OnConnect Debug ===');
    console.log('1. Received params:', params);

    if (params.data && params.phantom_encryption_public_key && params.nonce) {
      const url = Linking.createURL('onConnect', {
        queryParams: {
          phantom_encryption_public_key: params.phantom_encryption_public_key as string,
          data: params.data as string,
          nonce: params.nonce as string,
          ...(params.errorCode && { errorCode: params.errorCode as string }),
          ...(params.errorMessage && { errorMessage: params.errorMessage as string }),
        }
      });
      
      console.log('2. Constructed URL:', url);
      console.log('3. URL components:', {
        phantom_key: params.phantom_encryption_public_key,
        data: params.data,
        nonce: params.nonce
      });

      handleConnectResponse(url);
    } else {
      console.log('4. Missing required parameters:', {
        hasData: !!params.data,
        hasKey: !!params.phantom_encryption_public_key,
        hasNonce: !!params.nonce
      });
    }
  }, [params]);

  if (!params.data || !params.phantom_encryption_public_key || !params.nonce || params.errorCode) {
    console.log('5. Redirecting to home due to:', {
      missingData: !params.data,
      missingKey: !params.phantom_encryption_public_key,
      missingNonce: !params.nonce,
      hasError: !!params.errorCode
    });
    return <Redirect href="/LoginScreen" />;
  }

  return null;
} 