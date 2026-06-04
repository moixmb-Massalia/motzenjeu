import { NextResponse } from 'next/server';

// Mock leaderboard data (replace with Supabase query)
const LEADERBOARD = [
  { id: '1', username: 'Sophie L.', xp: 4850, level: 49, country: 'FR' },
  { id: '2', username: 'Marc D.', xp: 4120, level: 42, country: 'CA' },
  { id: '3', username: 'Elena K.', xp: 3900, level: 39, country: 'BE' },
  { id: '4', username: 'Jules B.', xp: 1200, level: 13, country: 'FR' },
  { id: '5', username: 'Amina S.', xp: 980, level: 10, country: 'MA' },
  { id: '6', username: 'Pierre T.', xp: 750, level: 8, country: 'FR' },
  { id: '7', username: 'Lea M.', xp: 640, level: 7, country: 'FR' },
  { id: '8', username: 'Karim B.', xp: 500, level: 6, country: 'DZ' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'global'; // global | weekly | friends

  // In a real app, filter by type and query Supabase
  return NextResponse.json({ type, players: LEADERBOARD });
}
