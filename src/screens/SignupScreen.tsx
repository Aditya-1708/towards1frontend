import { clsx } from "clsx";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import api from "../api/client";

interface SignupScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [passwdMssg, setPasswdMssg] = useState("");
  const [emailMssg, setEmailMssg] = useState("");
  const [nameMssg, setNameMssg] = useState("");

  const [focusedInput, setFocusedInput] = useState<"name" | "email" | "password" | null>(null);

  const validateName = (text: string) => {
    setName(text);
    if (!text.trim()) setNameMssg("Name is required");
    else setNameMssg("");
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /\S+@\S+\.\S+/;
    setEmailMssg(emailRegex.test(text) ? "" : "Invalid email address");
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    let msg = "";
    if (text.length < 10) msg = "Minimum 10 characters required";
    else if (!/[A-Z]/.test(text)) msg = "Add an uppercase letter (A-Z)";
    else if (!/[a-z]/.test(text)) msg = "Add a lowercase letter (a-z)";
    else if (!/[0-9]/.test(text)) msg = "Add a number (0-9)";
    else if (!/[!@#$%^&*(),.?":{}|<>_\-+=;']/g.test(text)) msg = "Add a special character";
    else if (text.includes(" ")) msg = "No spaces allowed";
    setPasswdMssg(msg);
  };

  const signup = async () => {
    if (nameMssg || emailMssg || passwdMssg) {
      Alert.alert("Invalid Input", "Please fix all errors before sign-up.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password });
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch {
      Alert.alert("Signup Failed", "Email already exists or network error");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (focused: boolean) =>
    twMerge(
      clsx(
        "w-full p-4 rounded-2xl text-base bg-gray-50/50 border-2 transition-all duration-200",
        "text-gray-800 placeholder:text-gray-400",
        focused
          ? "border-indigo-500 bg-white shadow-lg shadow-indigo-100"
          : "border-gray-100"
      )
    );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
            <View className="w-full max-w-md mx-auto mt-6">

              <Animated.View
                entering={FadeInDown.duration(1000).springify()}
                className="items-center mb-8"
              >
                <View className="w-16 h-16 bg-indigo-100 rounded-2xl items-center justify-center mb-4">
                  <Text className="text-indigo-600 text-3xl font-bold">+</Text>
                </View>
                <Text className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                  Create Account
                </Text>
                <Text className="text-gray-500 text-lg font-medium text-center">
                  Join us and start your journey
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}>
                <View className="space-y-5">
                  <View>
                    <Text className="text-gray-700 font-semibold mb-2 ml-1">Full Name</Text>
                    <TextInput
                      className={inputClasses(focusedInput === "name")}
                      placeholder="Your name"
                      placeholderTextColor="#9CA3AF"
                      value={name}
                      onChangeText={validateName}
                      onFocus={() => setFocusedInput("name")}
                      onBlur={() => setFocusedInput(null)}
                    />
                    {nameMssg ? <Text className="text-red-500 text-xs mt-1 ml-1">{nameMssg}</Text> : null}
                  </View>

                  <View>
                    <Text className="text-gray-700 font-semibold mb-2 ml-1">Email Address</Text>
                    <TextInput
                      className={inputClasses(focusedInput === "email")}
                      placeholder="you@email.com"
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={validateEmail}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                    />
                    {emailMssg ? <Text className="text-red-500 text-xs mt-1 ml-1">{emailMssg}</Text> : null}
                  </View>

                  <View>
                    <Text className="text-gray-700 font-semibold mb-2 ml-1">Password</Text>
                    <TextInput
                      className={inputClasses(focusedInput === "password")}
                      secureTextEntry
                      placeholder="Minimum 10 characters"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={validatePassword}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                    />
                    {passwdMssg ? <Text className="text-red-500 text-xs mt-1 ml-1">{passwdMssg}</Text> : null}
                  </View>

                  <TouchableOpacity
                    disabled={!!nameMssg || !!emailMssg || !!passwdMssg || !name || !email || !password}
                    className={clsx(
                      "mt-4 w-full p-4 rounded-2xl items-center shadow-xl shadow-indigo-200",
                      !!nameMssg || !!emailMssg || !!passwdMssg || !name || !email || !password
                        ? "bg-gray-300 shadow-none"
                        : "bg-indigo-600 active:bg-indigo-700"
                    )}
                    onPress={signup}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-bold text-lg tracking-wide">Create Account</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(400).duration(1000).springify()}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")} className="mt-8 mb-10">
                  <Text className="text-center text-gray-500 text-base font-medium">
                    Already have an account?{" "}
                    <Text className="text-indigo-600 font-bold">Log In</Text>
                  </Text>
                </TouchableOpacity>
              </Animated.View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
