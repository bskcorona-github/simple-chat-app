import { Server } from "socket.io";

let io: Server | null = null;

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    // 環境変数を利用して CORS 設定を切り替え
    const origin = process.env.FRONTEND_URL || "http://localhost:3000";

    io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: origin, // 環境変数で指定されたフロントエンドのURLを許可
        methods: ["GET", "POST"],
      },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("message", (msg: { username: string; message: string }) => {
        io?.emit("message", msg); // 全クライアントにメッセージを送信
      });
    });
  }
  res.end();
}
