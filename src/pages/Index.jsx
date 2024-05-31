import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Heading, Center } from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bwfvmnyldwrhcvxdrfdt.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };

    handleAuthChange();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const url = new URL(window.location.href);
    const accessToken = url.hash.match(/access_token=([^&]*)/);
    const refreshToken = url.hash.match(/refresh_token=([^&]*)/);
    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({
          access_token: accessToken[1],
          refresh_token: refreshToken[1],
        })
        .then(({ error }) => {
          if (!error) {
            navigate("/dashboard");
          } else {
            console.error("Error setting session:", error);
          }
        });
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://bwfvmnyldwrhcvxdrfdt.supabase.co/auth/v1/callback",
      },
    });
  };

  return (
    <Center height="100vh">
      <Box textAlign="center">
        <Heading mb={6}>Welcome to Our App</Heading>
        <Button leftIcon={<FaGoogle />} colorScheme="teal" onClick={handleLogin}>
          Login with Google
        </Button>
      </Box>
    </Center>
  );
};

export default Index;
