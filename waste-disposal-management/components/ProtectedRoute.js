import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../utils/firebaseConfig";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
  }, [auth, router]);
  

  if (loading) {
    return <Box
                sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
                }}
            >
                <CircularProgress />
            </Box>;
  }
  return children;
};

export default ProtectedRoute;
