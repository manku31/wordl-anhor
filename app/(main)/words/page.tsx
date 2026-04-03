import { getWords } from "@/app/actions/words";
import WordsClient from "./WordsClient";

export default async function MyWordsPage() {
  const words = await getWords();
  return <WordsClient initialWords={words} />;
}
