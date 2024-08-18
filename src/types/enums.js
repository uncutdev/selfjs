
/**
 * @enum {number}
 * @description Enum for gateway opcodes.
 */

const Opcodes = {
  /** 
   * @description An event was dispatched.
   */
  DISPATCH: 0,

  /** 
   * @description Fired periodically by the client to keep the connection alive.
   */
  HEARTBEAT: 1,

  /** 
   * @description Starts a new session during the initial handshake.
   */
  IDENTIFY: 2,

  /** 
   * @description Sent by the server to initiate a heartbeat and start the connection.
   */
  HELLO: 10,

  /** 
   * @description Acknowledges the receipt of a heartbeat.
   */
  HEARTBEAT_ACK: 11,
};


/**
 * @enum {string}
 * @description Enum for event names
 */
const Events = {
  READY: 'READY',  // Sent when the client is ready
  RESUMED: 'RESUMED',  // Sent when the client resumes a session
  MESSAGE_CREATE: 'MESSAGE_CREATE',  // Sent when a message is created
  MESSAGE_UPDATE: 'MESSAGE_UPDATE',  // Sent when a message is updated
  MESSAGE_DELETE: 'MESSAGE_DELETE',  // Sent when a message is deleted
  MESSAGE_DELETE_BULK: 'MESSAGE_DELETE_BULK',  // Sent when multiple messages are deleted at once
  MESSAGE_REACTION_ADD: 'MESSAGE_REACTION_ADD',  // Sent when a reaction is added to a message
  MESSAGE_REACTION_REMOVE: 'MESSAGE_REACTION_REMOVE',  // Sent when a reaction is removed from a message
  MESSAGE_REACTION_REMOVE_ALL: 'MESSAGE_REACTION_REMOVE_ALL',  // Sent when all reactions are removed from a message
  TYPING_START: 'TYPING_START',  // Sent when a user starts typing in a channel
  USER_UPDATE: 'USER_UPDATE',  // Sent when a user updates their profile
  PRESENCE_UPDATE: 'PRESENCE_UPDATE',  // Sent when a user's presence (status) updates
  GUILD_MEMBER_UPDATE: 'GUILD_MEMBER_UPDATE',  // Sent when a guild member updates their profile or roles
  VOICE_STATE_UPDATE: 'VOICE_STATE_UPDATE',  // Sent when a user's voice state (e.g., join, leave) changes
  GUILD_CREATE: 'GUILD_CREATE',  // Sent when the user joins a guild
  GUILD_DELETE: 'GUILD_DELETE',  // Sent when the user leaves a guild
  CHANNEL_CREATE: 'CHANNEL_CREATE',  // Sent when a new channel is created
  CHANNEL_UPDATE: 'CHANNEL_UPDATE',  // Sent when a channel is updated
  CHANNEL_DELETE: 'CHANNEL_DELETE',  // Sent when a channel is deleted
  CHANNEL_PINS_UPDATE: 'CHANNEL_PINS_UPDATE',  // Sent when pinned messages are updated in a channel
  WEBHOOKS_UPDATE: 'WEBHOOKS_UPDATE'
};

export {
  Opcodes,
  Events
}