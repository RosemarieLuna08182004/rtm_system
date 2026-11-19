import React, { useState, useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import * as S from '@/styles';
import { RoutesChannel } from '@/constants';
import { useAuth } from '@/hooks';
import { AuthService, AuthResult } from '@/services/AuthService';

export default function ImprovedGoogleSignIn() {
  const router = useRouter();
  const { setAuth, setPersist } = useAuth();
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<string>('ready');
  const authService = AuthService.getInstance();

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      if (loading) {
        Alert.alert(
          'Cancel Authentication?',
          'Are you sure you want to cancel the sign-in process?',
          [
            { text: 'Continue', style: 'cancel' },
            { text: 'Cancel', style: 'destructive', onPress: () => router.replace(RoutesChannel.SIGN_IN) }
          ]
        );
        return true;
      }
      router.replace(RoutesChannel.SIGN_IN);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setAuthStep('initializing');

      // Try AuthSession first (recommended)
      let result: AuthResult = await authService.signInWithGoogle();

      // Fallback to WebBrowser if AuthSession fails
      if (!result.success && result.error?.includes('AuthSession')) {
        console.log('Falling back to WebBrowser method');
        setAuthStep('fallback');
        result = await authService.signInWithGoogleWebBrowser();
      }

      if (result.success && result.user && result.accessToken) {
        setAuthStep('success');
        
        // Set authentication state
        setAuth({
          user: result.user,
          accessToken: result.accessToken,
          roles: result.user.AccountType,
          refreshToken: result.refreshToken,
          googleProvider: "google"
        });
        setPersist(true);

        // Show success message
        Alert.alert(
          'Welcome!',
          `Successfully signed in as ${result.user.Name || result.user.Email}`,
          [{ 
            text: 'Continue', 
            onPress: () => router.replace(RoutesChannel.HOME) 
          }]
        );
      } else {
        setAuthStep('error');
        const errorMessage = result.error || 'Authentication failed';
        authService.showAuthError(errorMessage);
      }

    } catch (error: any) {
      console.error('Sign-in error:', error);
      setAuthStep('error');
      authService.showAuthError(error.message || 'Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = (): string => {
    switch (authStep) {
      case 'ready': return 'Ready to sign in';
      case 'initializing': return 'Initializing Google Sign-In...';
      case 'fallback': return 'Trying alternative method...';
      case 'success': return 'Sign-in successful!';
      case 'error': return 'Sign-in failed';
      default: return 'Processing...';
    }
  };

  const getStatusColor = (): string => {
    switch (authStep) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <S.SafeAreaView className="flex-1 bg-white">
      <S.View className="flex-1 justify-center items-center px-8">
        
        {/* Header */}
        <S.View className="items-center mb-12">
          <S.Text className="text-3xl font-pbold text-gray-800 mb-2">
            Welcome Back
          </S.Text>
          <S.Text className="text-base font-pregular text-gray-600 text-center">
            Sign in with your Google account to continue
          </S.Text>
        </S.View>

        {/* Google Sign-In Button */}
        <S.TouchableOpacity
          className={`w-full bg-white border border-gray-300 rounded-xl p-4 flex-row items-center justify-center mb-6 ${
            loading ? 'opacity-50' : 'opacity-100'
          }`}
          onPress={handleGoogleSignIn}
          disabled={loading}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}
        >
          {loading ? (
            <S.ActivityIndicator size="small" color="#4285f4" />
          ) : (
            <>
              {/* Google Icon */}
              <S.View className="w-6 h-6 mr-3">
                <S.Text className="text-xl">🔍</S.Text>
              </S.View>
              <S.Text className="text-gray-700 font-pmedium text-base">
                Continue with Google
              </S.Text>
            </>
          )}
        </S.TouchableOpacity>

        {/* Status Message */}
        <S.View className="items-center mb-8">
          <S.Text className={`text-sm font-pregular ${getStatusColor()}`}>
            {getStatusMessage()}
          </S.Text>
        </S.View>

        {/* Loading Indicator */}
        {loading && (
          <S.View className="items-center">
            <S.View className="bg-blue-50 rounded-lg p-4 w-full max-w-sm">
              <S.View className="flex-row items-center justify-center mb-2">
                <S.ActivityIndicator size="small" color="#3b82f6" />
                <S.Text className="text-blue-700 font-pmedium ml-2">
                  Authenticating...
                </S.Text>
              </S.View>
              <S.Text className="text-blue-600 font-pregular text-xs text-center">
                This may take a few moments
              </S.Text>
            </S.View>
          </S.View>
        )}

        {/* Back Button */}
        {!loading && (
          <S.TouchableOpacity
            className="mt-8 py-3 px-6"
            onPress={() => router.replace(RoutesChannel.SIGN_IN)}
          >
            <S.Text className="text-gray-500 font-pregular text-base">
              ← Back to Sign In
            </S.Text>
          </S.TouchableOpacity>
        )}

        {/* Help Text */}
        <S.View className="absolute bottom-8 left-8 right-8">
          <S.Text className="text-xs font-pregular text-gray-400 text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </S.Text>
        </S.View>

      </S.View>
    </S.SafeAreaView>
  );
}
