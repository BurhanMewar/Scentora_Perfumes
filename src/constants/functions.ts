import { url } from "inspector";
import { useState, useEffect } from "react";
interface Permission {
  permissionTaskName: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface User {
  id: number;
  name: string;
  permissions: Permission[];
}

interface AutoPlaySoundProps {
  url?: string;
}
export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user and permissions
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/auth/get-user", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPermissions(data.user.permissions || []);
          }
        } else {
          setPermissions([]);
          throw new Error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Check if the user has permission
  const hasPermission = (taskName: string, action: string) => {
    if (!permissions || !Array.isArray(permissions)) return false;

    const permission = permissions.find(
      (perm) => perm.permissionTaskName.toLowerCase() === taskName.toLowerCase()
    );

    if (!permission) return false;

    switch (action.toLowerCase()) {
      case "view":
        return permission.canView;
      case "create":
        return permission.canCreate;
      case "update":
        return permission.canUpdate;
      case "delete":
        return permission.canDelete;
      default:
        return false;
    }
  };

  return { permissions, hasPermission, loading };
};

export default function AutoPlaySound({ url }: AutoPlaySoundProps) {
  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch((err) => {
      console.warn("Autoplay blocked or failed:", err);
    });
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [url]);

  return null; // no UI, just plays sound
}

