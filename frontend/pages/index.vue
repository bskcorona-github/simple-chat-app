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
      <div class="messages-container" ref="messagesContainer">
        <div v-for="(msg, index) in messages" :key="index">
          <strong>{{ msg.username }}:</strong> {{ msg.message }}
        </div>
      </div>
      <div class="message-input">
        <input v-model="message" @keyup.enter="sendMessage" placeholder="メッセージを入力..." />
        <button @click="sendMessage">送信</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRuntimeConfig } from "#app";
import Pusher from "pusher-js";

interface ChatMessage {
  username: string;
  message: string;
}

const username = ref(""); // ユーザー名
const usernameSet = ref(false); // ユーザー名が設定済みか
const messages = ref<ChatMessage[]>([]); // メッセージリスト
const message = ref(""); // 入力中のメッセージ
const messagesContainer = ref<HTMLDivElement | null>(null); // メッセージリストのコンテナ

onMounted(() => {
  const config = useRuntimeConfig();

  // 環境変数のログ出力
  console.log("Pusher Key:", config.public.pusherKey || "未設定");
  console.log("Pusher Cluster:", config.public.pusherCluster || "未設定");

  if (!config.public.pusherKey || !config.public.pusherCluster) {
    alert("環境変数が正しく設定されていません！");
    return;
  }

  // Pusher クライアントの初期化
  try {
    const pusher = new Pusher(config.public.pusherKey, {
      cluster: config.public.pusherCluster,
      forceTLS: true,
    });

    // チャンネルの購読
    const channel = pusher.subscribe("chat");
    channel.bind("message", (data: ChatMessage) => {
      messages.value.push(data); // メッセージリストに追加
      scrollToBottom(); // メッセージリストをスクロール
    });
  } catch (error) {
    console.error("Pusher 初期化エラー:", error);
    alert("Pusherの初期化に失敗しました！");
  }
});

// ユーザー名を設定
const setUsername = () => {
  if (username.value.trim() !== "") {
    usernameSet.value = true;
  } else {
    alert("ユーザー名を入力してください！");
  }
};

// メッセージを送信
const sendMessage = async () => {
  if (message.value.trim() !== "") {
    const config = useRuntimeConfig();
    const backendUrl = config.public.backendUrl || "http://localhost:3000";

    try {
      const response = await fetch(`${backendUrl}/api/pusher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "chat",
          event: "message",
          data: { username: username.value, message: message.value },
        }),
      });

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.statusText}`);
      }

      message.value = ""; // 入力フィールドをクリア
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
      alert("メッセージの送信に失敗しました！");
    }
  } else {
    alert("メッセージを入力してください！");
  }
};

// メッセージリストをスクロール
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 新しいメッセージが追加されたときに自動スクロール
watch(messages, () => {
  scrollToBottom();
});
</script>

<style scoped>
h1 {
  text-align: center;
}

.messages-container {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.message-input {
  display: flex;
  gap: 10px;
}

input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
