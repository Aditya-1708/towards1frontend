import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface ProfileData {
  id: number;
  email: string;
  name: string;
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  profile_image?: string;
}

export default function ProfileScreen({ navigation }: any) {
  const { token, setToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");

  const backend = "http://192.168.0.9:8000";

  const calculateScore = (p: ProfileData | null) => {
    if (!p) return 0;
    let score = 0;
    if (p.name) score += 20;
    if (p.bio) score += 20;
    if (p.profile_image) score += 30;
    if (p.github_url) score += 10;
    if (p.linkedin_url) score += 10;
    if (p.instagram_url) score += 10;
    return score;
  };

  const getLevel = (score: number) => {
    if (score === 100) return "Platinum";
    if (score >= 70) return "Gold";
    if (score >= 40) return "Silver";
    return "Bronze";
  };

  const loadProfile = async () => {
    try {
      const res = await api.get("/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setProfile(data);
      setName(data.name);
      setBio(data.bio || "");
      setGithub(data.github_url || "");
      setLinkedin(data.linkedin_url || "");
      setInstagram(data.instagram_url || "");
    } catch {
      Alert.alert("Error", "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  const validateSocialUrls = () => {
    const githubRegex = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
    const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;

    if (github && !githubRegex.test(github)) {
      Alert.alert("Invalid URL", "Please enter a valid GitHub profile URL.");
      return false;
    }
    if (linkedin && !linkedinRegex.test(linkedin)) {
      Alert.alert("Invalid URL", "Please enter a valid LinkedIn profile URL.");
      return false;
    }
    if (instagram && !instagramRegex.test(instagram)) {
      Alert.alert("Invalid URL", "Please enter a valid Instagram profile URL.");
      return false;
    }
    return true;
  };

  const updateProfile = async () => {
    if (!validateSocialUrls()) return;
    setSaving(true);
    try {
      const res = await api.put(
        "/profile/me",
        {
          name,
          bio,
          github_url: github,
          linkedin_url: linkedin,
          instagram_url: instagram,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      Alert.alert("Updated", "Profile saved successfully.");
    } catch {
      Alert.alert("Failed", "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const score = calculateScore(profile);
  const level = getLevel(score);

  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (result.canceled) return;

    const picked = result.assets[0];
    const uri = picked.uri;
    const filename = uri.split("/").pop() || "profile.jpg";

    const form = new FormData();
    form.append("file", {
      uri,
      name: filename,
      type: "image/jpeg",
    } as any);

    try {
      await api.post("/profile/upload-image", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      loadProfile();
      Alert.alert("Success", "Image updated!");
    } catch {
      Alert.alert("Upload Failed", "Please try again.");
    }
  };

  const handleLogout = () => {
    setToken(null);
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-500 mt-4">Loading Profile...</Text>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="items-center mb-6">
            <Text className="text-lg font-bold">Profile Level: {level}</Text>
            <View className="w-full bg-gray-300 h-4 rounded-xl mt-2 overflow-hidden max-w-xs">
              <View
                className="h-full bg-blue-600"
                style={{ width: `${score}%` }}
              />
            </View>
            <Text className="text-xs text-gray-600 mt-1">{score} / 100 XP</Text>
          </View>

          <View className="items-center mb-6">
            <TouchableOpacity onPress={uploadImage}>
              <Image
                source={{
                  uri: profile?.profile_image
                    ? `${backend}${profile.profile_image}`
                    : "https://via.placeholder.com/150",
                }}
                className="h-28 w-28 rounded-full border-4 border-white shadow"
              />
            </TouchableOpacity>
            <Text className="text-xs text-gray-500 mt-2">
              Tap to change photo
            </Text>
          </View>

          <Text className="font-semibold text-gray-700">Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-white p-3 rounded-xl my-2"
          />

          <Text className="font-semibold text-gray-700">Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            className="bg-white p-3 rounded-xl my-2 h-24"
          />

          <Text className="font-semibold text-gray-700 mt-4">GitHub</Text>
          <TextInput
            value={github}
            onChangeText={setGithub}
            className="bg-white p-3 rounded-xl my-2"
          />

          <Text className="font-semibold text-gray-700">LinkedIn</Text>
          <TextInput
            value={linkedin}
            onChangeText={setLinkedin}
            className="bg-white p-3 rounded-xl my-2"
          />

          <Text className="font-semibold text-gray-700">Instagram</Text>
          <TextInput
            value={instagram}
            onChangeText={setInstagram}
            className="bg-white p-3 rounded-xl my-2"
          />

          <TouchableOpacity
            onPress={updateProfile}
            disabled={saving}
            className="bg-blue-600 mt-6 p-4 rounded-xl"
          >
            <Text className="text-white font-bold text-center">
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="p-4 mt-3 rounded-xl bg-red-50"
          >
            <Text className="text-red-600 text-center font-semibold">
              Log Out
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
