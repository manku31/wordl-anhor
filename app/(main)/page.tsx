import FlashCard from "@/components/FlashCard";
import { getWords } from "@/app/actions/words";

export default async function Home() {
  const words = await getWords();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <FlashCard words={words} />
    </main>
  );
}
