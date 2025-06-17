import { useUser } from "@/store/authSlice"
import { checkUserPrivilege } from "@/lib/utils";

export const useAccess = (pageName: string) => {
  const user = useUser();
  const authorities = user?.authority ? [ ...user?.authority, "view_faqs"] : []
  const result = checkUserPrivilege(pageName, authorities);

  return result
}