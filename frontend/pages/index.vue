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
import { ref, onMounted } from "vue";
import Pusher from "pusher-js";

const username = ref("");
const usernameSet = ref(false);
const messages = ref<{ username: string; message: string }[]>([]);
const message = ref("");

onMounted(() => {
  const pusher = new Pusher("YOUR_PUSHER_KEY", {
    cluster: "YOUR_PUSHER_CLUSTER",
  });

  const channel = pusher.subscribe("chat");
  channel.bind("message", (data: { username: string; message: string }) => {
    messages.value.push(data);
  });
});

const setUsername = () => {
  if (username.value.trim() !== "") {
    usernameSet.value = true;
  }
};

const sendMessage = async () => {
  if (message.value.trim() !== "") {
    await fetch("/api/pusher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "chat",
        event: "message",
        data: { username: username.value, message: message.value },
      }),
    });
    message.value = "";
  }
};
</script>
