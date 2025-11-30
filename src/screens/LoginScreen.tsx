import { clsx } from "clsx";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { setToken } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | null>(null);

  const buttonScale = useSharedValue(1);

  const handlePressIn = () => (buttonScale.value = withSpring(0.95));
  const handlePressOut = () => (buttonScale.value = withSpring(1));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const validateInputs = (): boolean => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const login = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.access_token);
    } catch (error) {
      const err = error as ApiError;
      let errorMessage = "Something went wrong. Please try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid credentials. Please check your email and password.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message === "Network Error") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (isFocused: boolean) =>
    twMerge(
      clsx(
        "w-full p-4 rounded-2xl text-base bg-gray-50/50 border-2 transition-all duration-200",
        "text-gray-800 placeholder:text-gray-400",
        isFocused
          ? "border-indigo-500 bg-white shadow-lg shadow-indigo-100"
          : "border-gray-100"
      )
    );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6"
        >
          <View className="w-full max-w-md mx-auto">

            <Animated.View
              entering={FadeInDown.delay(100).duration(1000).springify()}
              className="items-center mb-10"
            >
              <View className="w-20 h-20 bg-indigo-600 rounded-3xl items-center justify-center mb-6 shadow-xl shadow-indigo-200 rotate-3">
                <Text className="text-white text-4xl font-bold">T</Text>
              </View>
              <Text className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-500 text-lg font-medium">
                Sign in to your account
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
              <View className="space-y-6">
                <View>
                  <Text className="mb-2 font-semibold text-gray-700 ml-1">Email</Text>
                  <TextInput
                    className={inputClasses(focusedInput === "email")}
                    placeholder="hello@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                <View>
                  <Text className="mb-2 font-semibold text-gray-700 ml-1">Password</Text>
                  <TextInput
                    className={inputClasses(focusedInput === "password")}
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <TouchableOpacity className="absolute right-4 top-[42px]">
                    <Text className="text-indigo-600 font-semibold text-sm">Forgot?</Text>
                  </TouchableOpacity>
                </View>

                <Animated.View style={animatedButtonStyle} className="mt-4">
                  <TouchableOpacity
                    className={clsx(
                      "w-full p-4 rounded-2xl flex-row justify-center items-center shadow-xl shadow-indigo-200",
                      isLoading ? "bg-indigo-400" : "bg-indigo-600"
                    )}
                    onPress={login}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" className="mr-2" />
                    ) : null}
                    <Text className="text-white text-center font-bold text-lg tracking-wide">
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400).duration(1000).springify()}>
              <View className="flex-row justify-center mt-12 items-center">
                <Text className="text-gray-500 text-base font-medium">New here? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                  <Text className="text-indigo-600 font-bold text-base">
                    Create account
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}