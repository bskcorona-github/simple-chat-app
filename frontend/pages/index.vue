<template>
  <div>
    <h1>Simple Chat App</h1>
    
    <!-- ユーザー名の入力 -->
    <div v-if="!usernameSet">
      <input v-model="username" placeholder="ユーザー名を入力" />
      <button @click="setUsername">開始</button>
    </div>

    <!-- チャット画面 -->
    <div v-else>
      <div v-for="(msg, index) in messages" :key="index">
        <strong>{{ msg.username }}:</strong> {{ msg.message }}
      </div>
      <input v-model="message" @keyup.enter="sendMessage" placeholder="メッセージを入力..." />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { io } from "socket.io-client";

// フロントエンドの Socket.IO 接続
const socket = io("https://simple-chat-app-drab.vercel.app", { path: "/api/socket" });


const username = ref(""); // ユーザー名
const usernameSet = ref(false); // ユーザー名が設定済みかどうか
const messages = ref<{ username: string; message: string }[]>([]); // メッセージリスト
const message = ref(""); // 入力中のメッセージ

onMounted(() => {
  // サーバーから受信したメッセージを表示
  socket.on("message", (msg: { username: string; message: string }) => {
    messages.value.push(msg);
  });
});

// ユーザー名を設定
const setUsername = () => {
  if (username.value.trim() !== "") {
    usernameSet.value = true;
  }
};

// メッセージを送信
const sendMessage = () => {
  if (message.value.trim() !== "") {
    socket.emit("message", { username: username.value, message: message.value });
    message.value = ""; // 入力フィールドをクリア
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
}
input {
  margin: 5px;
  padding: 5px;
}
</style>
