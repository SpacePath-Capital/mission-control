import { redirect } from 'next/navigation';

export default function Pros() {
  redirect('/missioncontrol/pros/snapshot');
  return null; // This line is technically unreachable but required by TypeScript
}