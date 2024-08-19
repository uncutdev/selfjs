import WebSocket from 'ws';
import EventEmitter from 'node:events';

/**
 * Enum for gateway opcodes.
 */
declare enum Opcodes {
    /** An event was dispatched. */
    DISPATCH = 0,
    /** Fired periodically by the client to keep the connection alive. */
    HEARTBEAT = 1,
    /** Starts a new session during the initial handshake. */
    IDENTIFY = 2,
    /** Sent by the server to initiate a heartbeat and start the connection. */
    HELLO = 10,
    /** Acknowledges the receipt of a heartbeat. */
    HEARTBEAT_ACK = 11
}
/**
 * Enum for event names.
 */
declare enum Events {
    READY = "READY",// Sent when the client is ready
    RESUMED = "RESUMED",// Sent when the client resumes a session
    MESSAGE_CREATE = "MESSAGE_CREATE",// Sent when a message is created
    MESSAGE_UPDATE = "MESSAGE_UPDATE",// Sent when a message is updated
    MESSAGE_DELETE = "MESSAGE_DELETE",// Sent when a message is deleted
    MESSAGE_DELETE_BULK = "MESSAGE_DELETE_BULK",// Sent when multiple messages are deleted at once
    MESSAGE_REACTION_ADD = "MESSAGE_REACTION_ADD",// Sent when a reaction is added to a message
    MESSAGE_REACTION_REMOVE = "MESSAGE_REACTION_REMOVE",// Sent when a reaction is removed from a message
    MESSAGE_REACTION_REMOVE_ALL = "MESSAGE_REACTION_REMOVE_ALL",// Sent when all reactions are removed from a message
    TYPING_START = "TYPING_START",// Sent when a user starts typing in a channel
    USER_UPDATE = "USER_UPDATE",// Sent when a user updates their profile
    PRESENCE_UPDATE = "PRESENCE_UPDATE",// Sent when a user's presence (status) updates
    GUILD_MEMBER_UPDATE = "GUILD_MEMBER_UPDATE",// Sent when a guild member updates their profile or roles
    VOICE_STATE_UPDATE = "VOICE_STATE_UPDATE",// Sent when a user's voice state (e.g., join, leave) changes
    GUILD_CREATE = "GUILD_CREATE",// Sent when the user joins a guild
    GUILD_DELETE = "GUILD_DELETE",// Sent when the user leaves a guild
    CHANNEL_CREATE = "CHANNEL_CREATE",// Sent when a new channel is created
    CHANNEL_UPDATE = "CHANNEL_UPDATE",// Sent when a channel is updated
    CHANNEL_DELETE = "CHANNEL_DELETE",// Sent when a channel is deleted
    CHANNEL_PINS_UPDATE = "CHANNEL_PINS_UPDATE",// Sent when pinned messages are updated in a channel
    WEBHOOKS_UPDATE = "WEBHOOKS_UPDATE"
}

interface Me {
    verified: boolean;
    username: string;
    purchased_flags: number;
    pronouns: string;
    premium_type: number;
    premium: boolean;
    phone: string | null;
    nsfw_allowed: boolean;
    mobile: boolean;
    mfa_enabled: boolean;
    id: string;
    global_name: string;
    flags: number;
    email: string;
    discriminator: string;
    desktop: boolean;
    clan: string | null;
    bio: string;
    banner_color: string | null;
    banner: string | null;
    avatar_decoration_data: object | null;
    avatar: string;
    accent_color: string | null;
}
interface Settings {
    detect_platform_accounts: boolean;
    animate_stickers: number;
    inline_attachment_media: boolean;
    status: string;
    message_display_compact: boolean;
    view_nsfw_guilds: boolean;
    timezone_offset: number;
    enable_tts_command: boolean;
    disable_games_tab: boolean;
    stream_notifications_enabled: boolean;
    animate_emoji: boolean;
    guild_folders: object[];
    activity_joining_restricted_guild_ids: string[];
    friend_source_flags: {
        all: boolean;
    };
    broadcast_allowed_user_ids: string[];
    convert_emoticons: boolean;
    afk_timeout: number;
    passwordless: boolean;
    contact_sync_enabled: boolean;
    broadcast_allow_friends: boolean;
    gif_auto_play: boolean;
    custom_status: string | null;
    native_phone_integration_enabled: boolean;
    allow_accessibility_detection: boolean;
    broadcast_allowed_guild_ids: string[];
    friend_discovery_flags: number;
    show_current_game: boolean;
    restricted_guilds: string[];
    developer_mode: boolean;
    view_nsfw_commands: boolean;
    render_reactions: boolean;
    locale: string;
    render_embeds: boolean;
    inline_embed_media: boolean;
    default_guilds_restricted: boolean;
    explicit_content_filter: number;
    activity_restricted_guild_ids: string[];
    theme: string;
}
interface GuildSettings {
    version: number;
    suppress_roles: boolean;
    suppress_everyone: boolean;
    notify_highlights: number;
    muted: boolean;
    mute_scheduled_events: boolean;
    mute_config: object | null;
    mobile_push: boolean;
    message_notifications: number;
    hide_muted_channels: boolean;
    guild_id: string;
    flags: number;
    channel_overrides: object[];
}
interface User {
    me: Me;
    settings: Settings;
    guild_settings: GuildSettings;
    connected_accounts: object[];
    auth_session_id_hash: string;
    analytics_token: string;
    friends: object[];
    group_chats: object[];
}
interface ResponseMessageType {
    op: number;
    d: any;
    s: number;
    t: string;
}

declare class SemiLib extends EventEmitter {
    #private;
    ws: WebSocket | null;
    user: User | null;
    constructor(token: string, reconnectDelay?: number, maxReconnectAttempts?: number);
    connect(): void;
}

export { Events, type GuildSettings, type Me, Opcodes, type ResponseMessageType, SemiLib, type Settings, type User };
