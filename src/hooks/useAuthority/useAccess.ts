import { useUser } from "@/store/authSlice"
import { checkUserPrivilege } from "@/lib/utils";

export const useAccess = (pageName: string) => {
  const user = useUser();

  const result = checkUserPrivilege(pageName, user?.authority ?? []);

  

  return result
}