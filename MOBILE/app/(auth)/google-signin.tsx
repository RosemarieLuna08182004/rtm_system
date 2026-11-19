import { API, RoutesChannel } from '@/constants';
import React, { useState, useEffect, useRef } from 'react'
import * as S from '@/styles'
import { Error, ErrorTitle } from '@/shared';
import { useAuth } from '@/hooks';
import { useRouter } from 'expo-router';
import { Alert, BackHandler } from 'react-native';

export default function GoogleSignIn() {
  const router = useRouter()
  const { setAuth, setPersist} = useAuth()
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState('initializing');
  const webViewRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleStartLoading = () => {
    setLoading(true);
    setAuthStep('loading');
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a longer timeout for OAuth flow
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setAuthStep('timeout');
    }, 30000); // 30 seconds timeout
  };

  const handleUrlRequest = (event: any) => {
    const url = event.url;
    console.log('WebView navigation:', url);
    
    // Handle different OAuth steps
    if (url.includes('accounts.google.com')) {
      setAuthStep('google-auth');
    } else if (url.includes('/auth/google/redirect')) {
      setAuthStep('processing');
    }
    
    handleStartLoading();
    return true;
  }
  
  // Handle back button
  useEffect(() => {
    const backAction = () => {
      router.replace(RoutesChannel.SIGN_IN);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getLoadingMessage = () => {
    switch (authStep) {
      case 'initializing': return 'Initializing Google Sign-In...';
      case 'loading': return 'Loading Google authentication...';
      case 'google-auth': return 'Redirecting to Google...';
      case 'processing': return 'Processing authentication...';
      case 'timeout': return 'Authentication is taking longer than expected...';
      default: return 'Processing authentication...';
    }
  };

  return (
    <>
      <S.SafeAreaView className="flex-1 bg-white">
        {/* Enhanced loading overlay */}
        {loading && (
          <S.View className='absolute inset-0 bg-white/95 flex-[1] justify-center items-center z-10 w-[100%] h-[100%]'>
            <S.View className="items-center">
              <S.ActivityIndicator size="large" color="#3b82f6" />
              <S.Text className="text-gray-700 text-lg mt-4 font-pmedium text-center px-8">
                {getLoadingMessage()}
              </S.Text>
              {authStep === 'timeout' && (
                <S.TouchableOpacity 
                  className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
                  onPress={() => router.replace(RoutesChannel.SIGN_IN)}
                >
                  <S.Text className="text-white font-psemibold">Go Back</S.Text>
                </S.TouchableOpacity>
              )}
            </S.View>
          </S.View>
        )}
        <S.WebView
          ref={webViewRef}
          source={{ uri: `${API}/auth/google` }}
          onShouldStartLoadWithRequest={handleUrlRequest}
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          onLoadStart={() => {
            setAuthStep('loading');
            setLoading(true);
          }}
          onLoadEnd={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            setLoading(false);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
            Alert.alert(
              'Connection Error',
              'Failed to connect to Google. Please check your internet connection and try again.',
              [
                { text: 'Retry', onPress: () => webViewRef.current?.reload() },
                { text: 'Go Back', onPress: () => router.replace(RoutesChannel.SIGN_IN) }
              ]
            );
          }}
          onMessage={(event) => {
            try {
              const response = JSON.parse(event.nativeEvent.data);
              console.log('WebView message received:', response);
              
              // Clear loading timeout
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              setLoading(false);
              
              if (response?.error) {
                console.error('OAuth error:', response.message);
                Alert.alert(
                  'Authentication Failed',
                  response.message || 'Failed to authenticate with Google. Please try again.',
                  [
                    { text: 'Try Again', onPress: () => webViewRef.current?.reload() },
                    { text: 'Go Back', onPress: () => router.replace(RoutesChannel.SIGN_IN) }
                  ]
                );
                return;
              }
              
              if (response?.data) {
                const { user, accessToken, refreshToken } = response.data;
                if (user && accessToken) {
                  setAuthStep('success');
                  setAuth({ 
                    user, 
                    accessToken, 
                    roles: user.AccountType, 
                    refreshToken, 
                    googleProvider: "google" 
                  });
                  setPersist(true);
                  
                  // Show success message briefly before redirect
                  Alert.alert(
                    'Welcome!',
                    `Successfully signed in as ${user.Name || user.Email}`,
                    [{ text: 'Continue', onPress: () => router.replace(RoutesChannel.HOME) }]
                  );
                } else {
                  console.error('Invalid user data received:', response.data);
                  Alert.alert(
                    'Authentication Error',
                    'Invalid user data received from server. Please try again.',
                    [
                      { text: 'Try Again', onPress: () => webViewRef.current?.reload() },
                      { text: 'Go Back', onPress: () => router.replace(RoutesChannel.SIGN_IN) }
                    ]
                  );
                }
              } else {
                console.error('No data in response:', response);
                Alert.alert(
                  'Authentication Error',
                  'No authentication data received. Please try again.',
                  [
                    { text: 'Try Again', onPress: () => webViewRef.current?.reload() },
                    { text: 'Go Back', onPress: () => router.replace(RoutesChannel.SIGN_IN) }
                  ]
                );
              }
            } catch (error) {
              console.error('Failed to parse WebView message:', error);
              Alert.alert(
                'Authentication Error',
                'Failed to process authentication response. Please try again.',
                [
                  { text: 'Try Again', onPress: () => webViewRef.current?.reload() },
                  { text: 'Go Back', onPress: () => router.replace(RoutesChannel.SIGN_IN) }
                ]
              );
            }
          }}
          injectedJavaScript={`
            (function() {
              try {
                const meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
                document.head.appendChild(meta);
                
                // The backend now sends HTML with embedded postMessage calls
                // So we don't need to parse JSON from body text anymore
                console.log('WebView JavaScript loaded, waiting for backend response...');
                
                // Fallback check in case the backend script doesn't execute
                setTimeout(() => {
                  const currentUrl = window.location.href;
                  console.log('Fallback check - Current URL:', currentUrl);
                  
                  if (currentUrl.includes('/auth/google/redirect')) {
                    // Check if we have any content that suggests an error
                    const bodyText = document.body.innerText.toLowerCase();
                    if (bodyText.includes('error') || bodyText.includes('not found') || bodyText.includes('unauthorized')) {
                      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                        error: true,
                        message: 'Authentication failed - please try again'
                      }));
                    }
                  }
                }, 5000);
                
                // Show enhanced loading UI
                document.body.innerHTML = \`
                  <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    flex-direction: column;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  ">
                    <div style="
                      background: white;
                      padding: 40px;
                      border-radius: 20px;
                      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                      text-align: center;
                      max-width: 300px;
                    ">
                      <div style="
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #3b82f6;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                      "></div>
                      <h2 style="
                        margin: 0 0 10px 0;
                        color: #1f2937;
                        font-size: 18px;
                        font-weight: 600;
                      ">Processing Authentication</h2>
                      <p style="
                        margin: 0;
                        color: #6b7280;
                        font-size: 14px;
                        line-height: 1.5;
                      ">Please wait while we securely sign you in with Google...</p>
                    </div>
                  </div>
                  <style>
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                    body { margin: 0; padding: 0; }
                  </style>
                \`;
              } catch (error) {
                console.error('Injection error:', error);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  error: true,
                  message: 'Authentication failed'
                }));
              }
            })();
            true;
          `}
          scalesPageToFit={false}
          javaScriptEnabled
          allowsBackForwardNavigationGestures={false}
          bounces={false}
        />
      </S.SafeAreaView>
    </>
  )
}