import { getUserMeLoader } from "@/data/services/user";
import LoginButtonClient from "./LoginButtonClient";

const LoginButtonServer = async () => {
  const user = await getUserMeLoader(); // Fetch user on the server

  return <LoginButtonClient isLoggedIn={user.ok} />;
};

export default LoginButtonServer;
