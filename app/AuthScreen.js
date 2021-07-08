import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";
import { Button, View } from "react-native";
import * as Linking from "expo-linking";

//Linking redirect...
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // Endpoint
  // const discovery = useAutoDiscovery('https://au-syd.appid.cloud.ibm.com/oauth/v4/24e8d3be-394d-469b-b9dc-48987bcbffa3/.well-known/openid-configuration');
  const discovery = useAutoDiscovery(
    "https://au-syd.appid.cloud.ibm.com/oauth/v4/24e8d3be-394d-469b-b9dc-48987bcbffa3"
  );
  const clientId = "6ea7cb17-4871-48d2-875a-d6436eddee9a";
  const clientSecret = "";
  const authUrl = "";
  const redirectUrl = "";
  // const baseRedirectUrl = Linking.makeUrl("/");
  // 'baseAuthUri'   => '{baseAuthUri}',
  //       'tenantId'      => '{tenantId}',
  //       'clientId'      => '{clientId}',
  //       'clientSecret'  => '{clientSecret}',
  //       'redirectUri'   => '{redirectUri}',

  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      scopes: ["openid", "profile", "email", "offline_access"],
      redirectUri: makeRedirectUri({ useProxy: true }),
    },
    discovery
  );

  // console.log("request", request, "response", response, "discovery", discovery);
  console.log("AuthSession Proxy", makeRedirectUri({ useProxy: true }));
  console.log("LINKING", Linking.makeUrl());
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
}
