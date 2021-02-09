<template>
  <div>
    <h1>Chat : {{ this.username }}'s room - {{ this.roomname }}</h1>
    <hr />
    <div id="chatContainer">
      <p v-for="message in messages" :key="message.date">
        {{ message.date }} - {{ message.text }}
      </p>
    </div>
    <div id="inputContainer">
      <hr />
      <b-form-input
        v-model="msg"
        placeholder="Enter your message"
        v-on:keyup.enter="sendMessage()"
        class="mt-auto"
      ></b-form-input>
    </div>
    <!-- DIalog -->
    <b-modal
      id="startupDialog"
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close="true"
    >
      <template #modal-title> Bienvenue sur l'UnderCover ! </template>
      <div class="d-block text-center">
        <b-form-input v-model="username" placeholder="Pseudo"></b-form-input>
        <hr />
        <b-form-input
          :disabled="this.roomInputDisabled"
          v-model="roomname"
          placeholder="Nom de la room"
        ></b-form-input>
      </div>
      <b-button class="mt-3" block @click="closeModal()">GO</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      messages: [],
      username: "",
      roomname: "",
      roomID: "",
      message: { date: "", text: "" },
      msg: "",
      dialog: true,
      roomUsers: [],
      roomInputDisabled: false,
      owner: null,
    };
  },
  mounted() {
    // arrivée par lien

    this.roomID = this.$route.query.ID;
    this.roomname = this.$route.query.Name;

    console.log(this.roomID);
    if (this.roomID == undefined && this.roomname == undefined) {
      console.log("noID");
    } else {
      this.roomInputDisabled = true;
    }
    // dialog pseduo uniquement

    this.$bvModal.show("startupDialog");
  },
  sockets: {
    messageSent(data) {
      var time = this.getTime();
      this.message.date = time;
      this.message.text = data.message;
      console.log(this.messages);
      this.messages.push(this.message);
      this.message = { date: "", text: "" };
    },

    loggedIn(data) {
      var time = this.getTime();
      this.messages.push({ date: time, text: data.message });
      this.roomUsers.push(data.user);
      this.owner = data.roomOwner;
      console.log(this.roomUsers);
    },
  },
  // http://localhost:8080/?ID=_p380nexlw&Name=psd
  methods: {
    join() {
      var data = {
        username: this.username,
        roomname: this.roomname,
        roomID: this.roomID,
        owner: this.owner,
      };

      this.$socket.client.emit("userConnected", data);
      console.log(this.messages);
    },
    sendMessage() {
      this.$socket.client.emit("messageSent", {
        usr: this.username,
        msg: this.msg,
        room: this.roomID,
      });
      this.msg = "";
    },

    closeModal() {
      if (this.roomID == undefined) {
        this.roomID = this.createRandomID();
        this.owner = this.username;
        window.history.pushState(
          null,
          null,
          "/?ID=" + this.roomID + "&Name=" + this.roomname
        );
      }
      this.join();
      this.$bvModal.hide("startupDialog");
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

    createRandomID() {
      return "_" + Math.random().toString(36).substr(2, 9);
    },
  },
};
</script>

<style lang="scss">
body {
  padding: 50px;
}

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

#inputContainer {
  position: fixed;
  bottom: 50px;
  width: 100%;
  padding-right: 100px;
}

#chatContainer {
  height: 85vh;
  overflow-y: scroll;
}
</style>
