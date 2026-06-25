import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { BACKEND_URL } from "../services/authService";

interface Member {
  id: string;
  name: string;
  email_personal: string;
  email_university: string;
  profile_picture_url: string;
  slug: string;
  roles: { id: string; name: string; description: string }[];
  // Adicionar outros campos conforme necessário
}

export function useCurrentMember() {
  const { user, token } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMember() {
      if (!user?.id || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/members/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}`);
        }

        const data = await response.json();
        setMember(data);
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMember();
  }, [user?.id, token]);

  return { member, isLoading };
}
