const CONSTANTS = {
    API_URL: "https://api.lanyard.rest/v1",
    WEBSOCKET_URL: "wss://api.lanyard.rest/socket",
    HEARTBEAT_PERIOD: 1000 * 30,
};

enum OPCODES {
    EVENT,
    HELLO,
    INITIALIZE,
    HEARTBEAT,
}

enum EVENTS {
    INIT_STATE = "INIT_STATE",
    PRESENCE_UPDATE = "PRESENCE_UPDATE",
}

type WebSocketSubscription = {
    subscribe_to_id?: string;
    subscribe_to_ids?: string[];
};

type Activity = {
    type: number;
    timestamps?: {
        start?: number;
        end?: number;
    };
    sync_id?: string;
    state?: string;
    session_id?: string;
    party?: {
        id: string;
    };
    name?: string;
    id: string;
    flags?: number;
    details?: string;
    created_at?: number;
    assets?: {
        large_text?: string;
        large_image?: string;
        small_text?: string;
        small_image?: string;
    };
    application_id?: string;
};

type DiscordUser = {
    username: string;
    public_flags: number;
    id: string;
    discriminator: string;
    avatar: string;
    avatar_decoration: string | null;
    bot: boolean;
    display_name: string | null;
};

type Spotify = {
    track_id: string;
    timestamps: {
        start: number;
        end: number;
    };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
};

type DiscordStatus = "online" | "idle" | "dnd" | "offline";

type KV = {
    [key: string]: string;
};

type Data = {
    active_on_discord_mobile: boolean;
    active_on_discord_desktop: boolean;
    active_on_discord_web: boolean;
    listening_to_spotify: boolean;
    kv: KV;
    spotify: Spotify | null;
    discord_user: DiscordUser;
    discord_status: DiscordStatus;
    activities: Activity[];
};

export async function connectWebSocket(userId: string | string[], onUpdate: (data: Data) => void, onError: (error: Error) => void): Promise<WebSocket | null> {
    const supportsWebSocket = "WebSocket" in window || "MozWebSocket" in window;

    if (!supportsWebSocket) {
        onError(new Error("Browser doesn't support WebSocket connections."));
        return null;
    }

    const socket = new WebSocket(CONSTANTS.WEBSOCKET_URL);
    const subscription: WebSocketSubscription = typeof userId === "string" ? { subscribe_to_id: userId } : { subscribe_to_ids: userId };
    let heartbeat: number | null = null;

    socket.addEventListener("open", () => {
        socket.send(
            JSON.stringify({
                op: OPCODES.INITIALIZE,
                d: subscription,
            })
        );

        heartbeat = setInterval(() => {
            socket.send(
                JSON.stringify({
                    op: OPCODES.HEARTBEAT,
                })
            );
        }, CONSTANTS.HEARTBEAT_PERIOD);
    });

    socket.addEventListener("message", ({ data }) => {
        const { t, d } = JSON.parse(data);

        if (t === EVENTS.INIT_STATE || t === EVENTS.PRESENCE_UPDATE) {
            onUpdate(d);
        }
    });

    socket.onclose = (event) => {
        clearInterval(heartbeat!);
        onError(new Error(`Socket closed with code ${event.code}`));
    };

    return socket;
}

export async function fetchUserData(userId: string): Promise<Data> {
    return new Promise((resolve, reject) => {
        fetch(`${CONSTANTS.API_URL}/users/${userId}`)
            .then((res) => res.json())
            .then((body) => {
                if (!body.success) {
                    reject(new Error(body.error?.message || "An invalid error occured"));
                }

                resolve(body.data);
            })
            .catch((err) => reject(err));
    });
}

export async function fetchUserDataForMultipleUsers(userIds: string[]): Promise<Data[]> {
    return new Promise((resolve, reject) => {
        const val: Data[] = [];

        for (const userId of userIds) {
            fetch(`${CONSTANTS.API_URL}/users/${userId}`)
                .then((res) => res.json())
                .then((body) => {
                    if (!body.success) {
                        reject(new Error(body.error?.message || "An invalid error occured"));
                    }

                    val.push(body.data);

                    if (val.length === userIds.length) {
                        resolve(val);
                    }
                })
                .catch((err) => reject(err));
        }
    })
}
