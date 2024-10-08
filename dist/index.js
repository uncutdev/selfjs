"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Events: () => Events,
  Opcodes: () => Opcodes,
  SelfJS: () => Client_default
});
module.exports = __toCommonJS(src_exports);

// src/types/enums.ts
var Opcodes = /* @__PURE__ */ ((Opcodes2) => {
  Opcodes2[Opcodes2["DISPATCH"] = 0] = "DISPATCH";
  Opcodes2[Opcodes2["HEARTBEAT"] = 1] = "HEARTBEAT";
  Opcodes2[Opcodes2["IDENTIFY"] = 2] = "IDENTIFY";
  Opcodes2[Opcodes2["HELLO"] = 10] = "HELLO";
  Opcodes2[Opcodes2["HEARTBEAT_ACK"] = 11] = "HEARTBEAT_ACK";
  return Opcodes2;
})(Opcodes || {});
var Events = /* @__PURE__ */ ((Events2) => {
  Events2["READY"] = "READY";
  Events2["RESUMED"] = "RESUMED";
  Events2["MESSAGE_CREATE"] = "MESSAGE_CREATE";
  Events2["MESSAGE_UPDATE"] = "MESSAGE_UPDATE";
  Events2["MESSAGE_DELETE"] = "MESSAGE_DELETE";
  Events2["MESSAGE_DELETE_BULK"] = "MESSAGE_DELETE_BULK";
  Events2["MESSAGE_REACTION_ADD"] = "MESSAGE_REACTION_ADD";
  Events2["MESSAGE_REACTION_REMOVE"] = "MESSAGE_REACTION_REMOVE";
  Events2["MESSAGE_REACTION_REMOVE_ALL"] = "MESSAGE_REACTION_REMOVE_ALL";
  Events2["TYPING_START"] = "TYPING_START";
  Events2["USER_UPDATE"] = "USER_UPDATE";
  Events2["PRESENCE_UPDATE"] = "PRESENCE_UPDATE";
  Events2["GUILD_MEMBER_UPDATE"] = "GUILD_MEMBER_UPDATE";
  Events2["VOICE_STATE_UPDATE"] = "VOICE_STATE_UPDATE";
  Events2["GUILD_CREATE"] = "GUILD_CREATE";
  Events2["GUILD_DELETE"] = "GUILD_DELETE";
  Events2["CHANNEL_CREATE"] = "CHANNEL_CREATE";
  Events2["CHANNEL_UPDATE"] = "CHANNEL_UPDATE";
  Events2["CHANNEL_DELETE"] = "CHANNEL_DELETE";
  Events2["CHANNEL_PINS_UPDATE"] = "CHANNEL_PINS_UPDATE";
  Events2["WEBHOOKS_UPDATE"] = "WEBHOOKS_UPDATE";
  return Events2;
})(Events || {});

// src/Client.ts
var import_ws = __toESM(require("ws"));
var import_node_events = __toESM(require("events"));
var SelfJS = class extends import_node_events.default {
  token;
  heartbeatInterval;
  lastHeartbeat;
  sequenceNumber;
  reconnectDelay;
  maxReconnectAttempts;
  reconnectAttempts;
  gatewayURL;
  ws;
  user;
  constructor(token, reconnectDelay = 5e3, maxReconnectAttempts = 5) {
    super();
    this.token = token;
    this.heartbeatInterval = null;
    this.lastHeartbeat = 0;
    this.sequenceNumber = null;
    this.reconnectDelay = reconnectDelay;
    this.maxReconnectAttempts = maxReconnectAttempts;
    this.reconnectAttempts = 0;
    this.gatewayURL = "wss://gateway.discord.gg/?v=10&encoding=json";
    this.ws = null;
    this.user = null;
  }
  connect() {
    try {
      this.ws = new import_ws.default(this.gatewayURL);
      this.ws.on("open", () => {
        console.log("Connected to Discord Gateway");
        this.identify();
      });
      this.ws.on("message", (data) => this.handleMessage(data));
      this.ws.on("error", console.error);
      this.ws.on("close", () => {
        console.log("Connection closed.");
        this.handleReconnect();
      });
    } catch (err) {
      console.error(err);
    }
  }
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      console.log(`Reconnecting in ${this.reconnectDelay / 1e3} seconds...`);
      setTimeout(() => {
        this.reconnectAttempts += 1;
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.log("Failed to reconnect.");
    }
  }
  identify() {
    const payload = {
      op: 2,
      // IDENTIFY op
      d: {
        token: this.token,
        intents: 32769,
        properties: {
          $os: process.platform,
          $browser: "selfjs",
          $device: "selfjs"
        },
        compress: false,
        large_threshold: 250
      }
    };
    this.ws?.send(JSON.stringify(payload));
  }
  startHeartbeat() {
    setInterval(() => {
      if (this.ws?.readyState === import_ws.default.OPEN) {
        const heartbeatPayload = {
          op: 1,
          d: this.sequenceNumber
        };
        this.ws.send(JSON.stringify(heartbeatPayload));
        this.lastHeartbeat = Date.now();
      }
    }, this.heartbeatInterval);
  }
  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      const messageData = message?.d;
      switch (message.op) {
        case 10 /* HELLO */:
          this.heartbeatInterval = message.d.heartbeat_interval;
          this.startHeartbeat();
          break;
        case 0 /* DISPATCH */:
          this.sequenceNumber = message.s;
          if (message.t === "READY" /* READY */) {
            this.user = {
              me: messageData.user,
              settings: messageData.user_settings,
              guild_settings: messageData.user_guild_settings,
              connected_accounts: messageData.connected_accounts,
              auth_session_id_hash: messageData.auth_session_id_hash,
              analytics_token: messageData.analytics_token,
              friends: messageData.relationships,
              group_chats: messageData.private_channels.filter((channel) => channel.type === 3)
            };
            this.emit(message.t);
          } else if (Object.values(Events).includes(message.t)) {
            this.emit(message.t, messageData);
          }
          break;
        default:
          if (message.op !== 11 /* HEARTBEAT_ACK */) {
            console.log("Received unknown opcode:", message);
          }
      }
    } catch (err) {
      console.error("Failed to parse message:", data);
    }
  }
};
var Client_default = SelfJS;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Events,
  Opcodes,
  SelfJS
});
