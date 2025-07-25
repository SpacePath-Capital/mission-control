import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/missioncontrol/home');
  return null; // This line is technically unreachable but required by TypeScript
}