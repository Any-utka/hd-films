// src/data/db.tsx
import * as SQLite from "expo-sqlite";
import { Movie } from "../hooks/useMovies";
import * as CryptoJS from "crypto-js";

let db: any = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("movieapp.db");
  }
  return db;
};

const hash = (txt: string) => CryptoJS.SHA256(txt).toString();

export const initDB = async () => {
  const database = await getDB();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      overview TEXT,
      age TEXT,
      genres TEXT,
      duration TEXT,
      year INTEGER,
      poster TEXT,
      link TEXT
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      movieId INTEGER NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);

  await seedDefaultUsers();
};

const seedDefaultUsers = async () => {
  const database = await getDB();
  const users = [
    { name: "Anyuta", email: "anna@mail.com", password: hash("123456"), avatar: "https://ui-avatars.com/api/?name=Anyuta" },
    { name: "Victor", email: "victor@mail.com", password: hash("123456"), avatar: "https://ui-avatars.com/api/?name=Victor" },
  ];

  for (const u of users) {
    await database.runAsync(
      `INSERT OR IGNORE INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)`,
      [u.name, u.email, u.password, u.avatar]
    );
  }
};

export const populateMovies = async (movies: Movie[]) => {
  const database = await getDB();
  for (const movie of movies) {
    await database.runAsync(
      `INSERT OR IGNORE INTO movies
      (id, title, overview, age, genres, duration, year, poster, link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movie.id,
        movie.title,
        movie.overview,
        movie.age,
        JSON.stringify(movie.genres),
        movie.duration,
        movie.year,
        movie.poster,
        movie.link || ""
      ]
    );
  }
};

export const setupDatabase = async () => {
  await initDB();

  const INITIAL_MOVIES: Movie[] = [
    { id: 1, title: "Рыжая Соня", overview: "Рыжая Соня — последняя представительница своего народа...", age: "18+", genres: ["фэнтези","боевик"], duration: "110 мин", year: 2025, poster: "https://kinogo-films.biz/uploads/mini/fullstory8/29/4a8ccbc6b38f02169f7fa1074534be.webp", link: "https://kinogo.online/filmy/111749-ryzhaya-sonya.html" },
    { id: 2, title: "Семейный призрак", overview: "Василий находит дешёвую квартиру, но у неё есть секрет...", age: "6+", genres: ["комедия","фантастика"], duration: "80 мин", year: 2025, poster: "https://kinogo-films.biz/uploads/mini/fullstory8/27/a1be0449e7dabae21afcb26e8534e1.webp", link: "https://kinogo.online/filmy/108573-semeynyy-prizrak.html" },
    { id: 3, title: "Соловей против Муромца", overview: "Соловей-разбойник переписал историю и присвоил славу Илье Муромцу.", age: "12+", genres: ["приключения","фантастика"], duration: "115 мин", year: 2025, poster: "https://kinogo-films.biz/uploads/mini/fullstory8/81/0eda04778767aa659a8564e99f1d79.webp", link: "https://kinogo.online/filmy/106601-solovej-protiv-muromca.html" },
  ];

  await populateMovies(INITIAL_MOVIES);
};
