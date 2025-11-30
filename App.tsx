import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import "./global.css";

const Stack = createNativeStackNavigator();

function Routes() {
  const { token } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="Profile" component={ProfileScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </AuthProvider>
  );
}
