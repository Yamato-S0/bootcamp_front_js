import express from "express";
import { databaseManager } from "@/db/database_manager";

export const app = express();

//特定のURLにリクエストが来た時に、DBからタスクを取得してJSONで返すルーティングを作成
app.get("/tasks", async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
    //DBからタスクを取得
    const db = await databaseManager.getInstance();
    const result = await db.all("SELECT * FROM tasks");
    //取得したタスクをJSONで返す
    res.json(result);
});
