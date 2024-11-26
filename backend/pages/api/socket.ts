import { Server } from "socket.io";

let io: Server | null = null;

export default function handler(req: any, res: any) {
  // 既存の Socket.IO サーバーがない場合のみ初期化
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      // クライアントから受信したメッセージを全クライアントに送信
      socket.on("message", (msg: { username: string; message: string }) => {
        io?.emit("message", msg);
      });
    });
  }
  res.end(); // 必ずレスポンスを終了
}
