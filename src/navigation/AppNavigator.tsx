import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import SignInScreen from "../pages/SignInScreen";
import SignUpScreen from "../pages/SignUpScreen";
import HomeScreen from "../pages/HomeScreen";
import MiscellaneousListScreen from "../pages/MiscellaneousListScreen";
import InvitesScreen from "../pages/InvitesScreen";
import QRCodeScreen from "../pages/QRCodeScreen";

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Home: undefined;
  MiscellaneousList: undefined;
  Invites: undefined;
  QRCode: { sessionId: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="MiscellaneousList"
              children={({ navigation }) => (
                <MiscellaneousListScreen
                  onSelect={(id) => navigation.navigate('Home')}
                />
              )}
            />
            <Stack.Screen name="Invites" component={InvitesScreen} />
            <Stack.Screen
              name="QRCode"
              children={({ route }) => <QRCodeScreen sessionId={(route.params as { sessionId: string }).sessionId} />}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
