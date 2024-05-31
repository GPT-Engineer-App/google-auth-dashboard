import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Center, Text } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bwfvmnyldwrhcvxdrfdt.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY"; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Center height="100vh">
      <Box textAlign="center">
        <Heading mb={6}>Dashboard</Heading>
        {user && <Text mb={6}>Welcome, {user.email}</Text>}
        <Button colorScheme="teal" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Center>
  );
};

export default Dashboard;
