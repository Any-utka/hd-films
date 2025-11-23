import { getDB } from '../data/db';
import { User } from '../types/User';

export const getFavorites = async (user: User | null): Promise<number[]> => {
  if (!user) return [];

  try {
    const db = await getDB();
    const userData = await db.getFirstAsync('SELECT id FROM users WHERE email = ?;', [user.email]);
    if (!userData) return [];

    const favRes = await db.getAllAsync('SELECT movieId FROM favorites WHERE userId = ?;', [userData.id]);
    return favRes.map((f: any) => f.movieId);
  } catch (err) {
    console.error('Error getting favorites:', err);
    return [];
  }
};
