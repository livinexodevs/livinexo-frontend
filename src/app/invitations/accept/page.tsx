import { redirect } from "next/navigation";

interface InvitationAcceptPageProps {
  searchParams?: {
    token?: string;
    houseId?: string;
  };
}

export default function InvitationAcceptPage({
  searchParams,
}: InvitationAcceptPageProps) {
  const token = searchParams?.token ?? "";
  const houseId = searchParams?.houseId ?? "";

  const params = new URLSearchParams();
  if (token) params.set("token", token);
  if (houseId) params.set("houseId", houseId);

  const query = params.toString();
  redirect(
    query ? `/onboarding/join-house?${query}` : "/onboarding/join-house"
  );
}
