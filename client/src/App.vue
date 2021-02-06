<template>
  <div>
    <h1>Chat :</h1>
    <p v-for="message in messages" :key="message.date">
      {{ message.date }} - {{ message.text }}
    </p>
    <hr />
    <input type="text" v-model="msg" v-on:keyup.enter="sendMessage()" />
    <button v-on:click="sendMessage()" id="sendButton">SEND</button>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "App",
  components: {},
  data() {
    return {
      socket: io("http://127.0.0.1:3000"),
      messages: [],
      username: "",
      message: { date: "", text: "" },
    };
  },

  methods: {
    join() {
      
      this.socket.emit("userConnected", this.username);
      console.log(this.messages);
      
    },
    sendMessage() {
      this.socket.emit("messageSent", { usr: this.username, msg: this.msg });
    },

    // listeners
    listen() {
      // reception message
      this.socket.on("messageSent", (data) => {
        var time = this.getTime();
        this.message.date = time;
        this.message.text = data.message;
        console.log(this.messages);
        this.messages.push(this.message);
        this.message = { date: "", text: "" };

        // user login
        this.socket.on("loggedIn", (data) => {
          this.messages.push({ date: time, text: data.message });
        });
      });
    },

    getTime() {
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();

      if (hours < 10) {
        hours = "0" + hours;
      }

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      return hours + ":" + minutes;
    },
  },

  mounted() {
    this.listen();
    this.username = prompt("Pseudo :", "anonyme");

    if (!this.username) {
      this.username = "default";
    }

    this.join();
  },
};
</script>

<style lang="scss">
#app {
  height: 100vh;
  width: 100vw;
}

#sendButton {
  width: 100px;
  // background-color: rgb(0, 142, 236);
  // color: white;
  // border-radius: 15px;
}
</style>
