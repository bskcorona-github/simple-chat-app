import { Server } from "socket.io";

let io: Server | null = null;

export default function handler(req: any, res: any) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
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
