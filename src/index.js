import WebSocket from "ws";
import EventEmitter from "node:events";
import { Opcodes, Events } from "./types/enums.js";



/**
 * Response message from server
 * @typedef {Object} ResponseMessageType
 * @property {number} op - Gateway opcode
 * @property {Object} d - Event data
 * @property {number} s - Sequence number
 * @property {number} t - Event name
 * 
 */


/**
 * @typedef {Object} Me
 * @property {boolean} verified - Indicates if the user is verified.
 * @property {string} username - The username of the user.
 * @property {number} purchased_flags - Flags related to purchases the user has made.
 * @property {string} pronouns - The pronouns of the user.
 * @property {number} premium_type - Type of premium subscription the user has.
 * @property {boolean} premium - Indicates if the user has premium access.
 * @property {?string} phone - The phone number of the user, or null if not provided.
 * @property {boolean} nsfw_allowed - Indicates if the user allows NSFW content.
 * @property {boolean} mobile - Indicates if the user is using a mobile device.
 * @property {boolean} mfa_enabled - Indicates if the user has multi-factor authentication enabled.
 * @property {string} id - The unique identifier of the user.
 * @property {string} global_name - The global name of the user.
 * @property {number} flags - Various flags related to the user's account.
 * @property {string} email - The email address of the user.
 * @property {string} discriminator - The user's discriminator (unique 4-digit number).
 * @property {boolean} desktop - Indicates if the user is using a desktop device.
 * @property {?string} clan - The user's clan, or null if not applicable.
 * @property {string} bio - The user's biography or description.
 * @property {?string} banner_color - The color of the user's banner, or null if not set.
 * @property {?string} banner - The URL of the user's banner image, or null if not set.
 * @property {?Object} avatar_decoration_data - Data for avatar decoration, or null if not applicable.
 * @property {string} avatar - The URL of the user's avatar.
 * @property {?string} accent_color - The color of the user's accent, or null if not set.
 */


/**
 * @typedef {Object} Settings
 * @property {boolean} detect_platform_accounts - Whether platform accounts are detected.
 * @property {number} animate_stickers - Controls sticker animations (0 = disabled, 1 = enabled).
 * @property {boolean} inline_attachment_media - Whether to inline media in attachments.
 * @property {string} status - The user's status (e.g., 'dnd' for do not disturb).
 * @property {boolean} message_display_compact - Whether to use compact message display.
 * @property {boolean} view_nsfw_guilds - Whether to view NSFW content in guilds.
 * @property {number} timezone_offset - The user's timezone offset in minutes.
 * @property {boolean} enable_tts_command - Whether the TTS command is enabled.
 * @property {boolean} disable_games_tab - Whether the games tab is disabled.
 * @property {boolean} stream_notifications_enabled - Whether stream notifications are enabled.
 * @property {boolean} animate_emoji - Whether emoji animations are enabled.
 * @property {Array<Object>} guild_folders - List of guild folders (empty array if none).
 * @property {Array<string>} activity_joining_restricted_guild_ids - List of guild IDs where activity joining is restricted.
 * @property {Object} friend_source_flags - Flags for friend sources.
 * @property {boolean} friend_source_flags.all - Whether all friend source flags are enabled.
 * @property {Array<string>} broadcast_allowed_user_ids - List of user IDs allowed for broadcast.
 * @property {boolean} convert_emoticons - Whether emoticons are converted to emoji.
 * @property {number} afk_timeout - AFK timeout in seconds.
 * @property {boolean} passwordless - Whether passwordless authentication is enabled.
 * @property {boolean} contact_sync_enabled - Whether contact sync is enabled.
 * @property {boolean} broadcast_allow_friends - Whether to allow broadcast to friends.
 * @property {boolean} gif_auto_play - Whether GIFs are set to auto-play.
 * @property {?string} custom_status - The user's custom status, or null if not set.
 * @property {boolean} native_phone_integration_enabled - Whether native phone integration is enabled.
 * @property {boolean} allow_accessibility_detection - Whether accessibility detection is allowed.
 * @property {Array<string>} broadcast_allowed_guild_ids - List of guild IDs allowed for broadcast.
 * @property {number} friend_discovery_flags - Flags for friend discovery.
 * @property {boolean} show_current_game - Whether to show the current game status.
 * @property {Array<string>} restricted_guilds - List of restricted guilds.
 * @property {boolean} developer_mode - Whether developer mode is enabled.
 * @property {boolean} view_nsfw_commands - Whether to view NSFW commands.
 * @property {boolean} render_reactions - Whether to render reactions.
 * @property {string} locale - The user's locale (e.g., 'en-US').
 * @property {boolean} render_embeds - Whether to render embeds.
 * @property {boolean} inline_embed_media - Whether to inline media in embeds.
 * @property {boolean} default_guilds_restricted - Whether default guilds are restricted.
 * @property {number} explicit_content_filter - Level of explicit content filter (0, 1, or 2).
 * @property {Array<string>} activity_restricted_guild_ids - List of guild IDs where activity is restricted.
 * @property {string} theme - The user's theme (e.g., 'dark').
 */


/**
 * @typedef {Object} GuildSettings
 * @property {number} version - The version of the guild settings.
 * @property {boolean} suppress_roles - Whether role mentions are suppressed.
 * @property {boolean} suppress_everyone - Whether @everyone and @here mentions are suppressed.
 * @property {number} notify_highlights - The type of notifications for highlights (0 = default).
 * @property {boolean} muted - Whether the user is muted in the guild.
 * @property {boolean} mute_scheduled_events - Whether scheduled events are muted.
 * @property {?Object} mute_config - Configuration for muting, or null if not set.
 * @property {boolean} mobile_push - Whether mobile push notifications are enabled.
 * @property {number} message_notifications - Level of message notifications (0 = all, 1 = mentions only).
 * @property {boolean} hide_muted_channels - Whether muted channels are hidden.
 * @property {string} guild_id - The ID of the guild.
 * @property {number} flags - Various flags related to the guild settings.
 * @property {Array<Object>} channel_overrides - List of channel-specific overrides.
 */

/**
 * @typedef {Object} User
 * @property {Me} me
 * @property {Settings} settings
 * @property {GuildSettings} guild_settings
 * @property {Array<Object>} connected_accounts
 * @property {string} auth_session_id_hash
 * @property {string} analytics_token
 * @property {Array<Object>} friends
 * @property {Array<Object>} group_chats
 */






class SemiLib extends EventEmitter {
  #token;
  #heartbeatInterval;
  #lastHeartbeat;
  #sequenceNumber;
  #reconnectDelay;
  #maxReconnectAttempts;
  #reconnectAttempts
  #gatewayURL;


  constructor(token, reconnectDelay = 5000, maxReconnectAttempts = 5) {
    super();
    this.#token = token;
    this.#heartbeatInterval = null;
    this.#lastHeartbeat = 0;
    this.#sequenceNumber = null;
    this.#reconnectDelay = reconnectDelay;
    this.#maxReconnectAttempts = maxReconnectAttempts;
    this.#reconnectAttempts = 0;
    this.#gatewayURL = "wss://gateway.discord.gg/?v=10&encoding=json";


    this.ws = null;
    this.user = null;
  }

  connect() {

    try {
      this.ws = new WebSocket(this.#gatewayURL);

      this.ws.on("open", () => {
        console.log('Connected to Discord Gateway');
        this.#identify();
      });

      this.ws.on("message", data => this.#handleMessage(data));

      this.ws.on("error", console.error)

      this.ws.on("close", () => {
        console.log('Connection closed.');
        this.#handleReconnect();
      })

    } catch (err) {
      console.error(err);
    }


  }

  #handleReconnect() {
    if (this.#reconnectAttempts < this.#maxReconnectAttempts) {
      console.log(`Reconnecting in ${this.#reconnectDelay / 1000} seconds...`);

      setTimeout(() => {

        this.#reconnectAttempts += 1;
        this.connect();

      }, this.#reconnectDelay);

    } else {
      console.log('Failed to reconnect.');
    }
  }

  #identify() {
    const payload = {
      op: 2, // IDENTIFY op
      d: {
        token: this.#token,
        intents: 32769,
        properties: {
          $os: process.platform,
          $browser: 'semilib',
          $device: 'semilib'
        },
        compress: false,
        large_threshold: 250,
      }
    };

    this.ws.send(JSON.stringify(payload));
  }


  #startHeartbeat() {

    setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        const heartbeatPayload = {
          op: 1,
          d: this.#sequenceNumber
        };

        this.ws.send(JSON.stringify(heartbeatPayload));
        this.#lastHeartbeat = Date.now();
      }

    }, this.#heartbeatInterval);
  }


  #handleMessage(data) {

    /**
     * @type {ResponseMessageType} 
     */

    const message = JSON.parse(data);
    const messageData = message?.d;

    switch (message.op) {
      case Opcodes.HELLO:
        this.#heartbeatInterval = message.d.heartbeat_interval;
        this.#startHeartbeat();
        break;

      case Opcodes.DISPATCH:

        this.#sequenceNumber = message.s;

        if (message.t === Events.READY) {


          /** 
           * User data
           * @type {User}
           *  
           */
          this.user = {
            me: messageData.user,
            settings: messageData.user_settings,
            guild_settings: messageData.user_guild_settings,
            connected_accounts: messageData.connected_accounts,
            auth_session_id_hash: messageData.auth_session_id_hash,
            analytics_token: messageData.analytics_token,
            friends: messageData.relationships,
            group_chats: messageData.private_channels.filter(channel => channel.type === 3),
          };


        } else if (Events[message?.t]) this.emit(Events[message.t], messageData);


        break;

      default:
        message.op === Opcodes.HEARTBEAT_ACK ? '' : console.log('Received unknown opcode:', message);
    }


  }
}

export default SemiLib;