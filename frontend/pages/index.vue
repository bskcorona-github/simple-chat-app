<template>
  <div>
    <h1>Simple Chat App</h1>

    <div v-if="!usernameSet">
      <input v-model="username" placeholder="ユーザー名を入力" />
      <button @click="setUsername">開始</button>
    </div>

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
import { useRuntimeConfig } from "#app";
import Pusher from "pusher-js";

interface ChatMessage {
  username: string;
  message: string;
}

const username = ref("");
const usernameSet = ref(false);
const messages = ref<ChatMessage[]>([]);
const message = ref("");

onMounted(() => {
  const config = useRuntimeConfig();

  console.log("Pusher Key from runtimeConfig:", config.public.pusherKey);
  console.log("Pusher Cluster from runtimeConfig:", config.public.pusherCluster);

  const pusher = new Pusher(config.public.pusherKey, {
    cluster: config.public.pusherCluster,
  });

  const channel = pusher.subscribe("chat");
  channel.bind("message", (data: ChatMessage) => {
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
    const config = useRuntimeConfig();

    await fetch(`${config.public.backendUrl}/api/pusher`, {
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

<style scoped>
h1 {
  text-align: center;
}
input {
  margin: 5px;
  padding: 5px;
}
</style>
