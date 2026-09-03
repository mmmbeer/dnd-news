import { SharedNewspaperView } from "@/components/studio/SharedNewspaperView";

export default async function SharedNewspaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SharedNewspaperView id={id} />;
}
