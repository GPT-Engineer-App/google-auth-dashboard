import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Center, Text, Flex, VStack, HStack, Image } from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bwfvmnyldwrhcvxdrfdt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZnZtbnlsZHdyaGN2eGRyZmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxMjIwMzIsImV4cCI6MjAzMjY5ODAzMn0.p-g_isByyrQ8-M6xIuNT6Mzswgs1VmrFq2wjmQ_4Quc";
const supabase = createClient(supabaseUrl, supabaseKey);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else if (error) {
        console.error("Error fetching session:", error);
        navigate("/");
      } else {
        const {
          data: { session: refreshedSession },
          error: refreshError,
        } = await supabase.auth.refreshSession();
        if (refreshedSession) {
          setUser(refreshedSession.user);
        } else {
          console.error("Error refreshing session:", refreshError);
          navigate("/");
        }
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
