import express from "express";
import { databaseManager } from "@/db/database_manager";

export const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

//特定のURLにリクエストが来た時に、DBからタスクを取得してJSONで返すルーティングを作成
app.get("/tasks", async (req, res) => {
    //DBからタスクを取得
    const db = await databaseManager.getInstance();
    const result = await db.all("SELECT * FROM tasks");
    //取得したタスクをJSONで返す
    res.json(result);
});

//特定のURLにリクエストが来た時に、DBにタスクを追加するルーティングを作成
app.post("/tasks", async (req, res) => {
    //リクエストの中身を取得
    const id = req.body.id;
    const title = req.body.title;
    const status = req.body.status;
    //DBにタスクを追加
    const db = await databaseManager.getInstance();
    await db.run("INSERT INTO tasks (id, title, status) VALUES (?, ?, ?)", id, title, status);
    //追加したタスクをJSONで返す
    res.json({ id, title, status});
});

//特定のURLにリクエストが来た時に、DBのタスクを更新するルーティングを作成
app.put("/tasks", async (req, res) => {
    //リクエストの中身を取得
    const title = req.body.title;
    //DBのタスクを更新
    const db = await databaseManager.getInstance();
    await db.run("UPDATE tasks SET status = 1 WHERE title = ?", title);
    //更新したタスクをJSONで返す
    res.json({ title });
}
);

//特定のURLにリクエストが来た時に、DBのタスクを削除するルーティングを作成
app.delete("/tasks", async (req, res) => {
    //DBのタスクを削除
    const db = await databaseManager.getInstance();
    await db.run("DELETE FROM tasks WHERE status = 1");
    //削除したタスクをJSONで返す
    res.json({});
}
);