import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/missioncontrol');
  return null; // Required by TypeScript
}