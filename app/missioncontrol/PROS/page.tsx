import { redirect } from 'next/navigation';

export default function Pros() {
  redirect('/missioncontrol/PROS/snapshot'); // correct, uppercase PROS
  return null;
}
