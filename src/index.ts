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

/**
 * Connects to the Lanyard WebSocket API
 * @param userId The user ID to connect to
 * @param onUpdate Callback function that is called when the user's presence is updated
 * @returns The WebSocket connection
 * @throws Error if the browser doesn't support WebSocket connections
 * @throws Error if the WebSocket connection is closed
 */
export async function connectWebSocket(userId: string | string[], onUpdate: (data: Data) => void): Promise<WebSocket> {
    const supportsWebSocket = "WebSocket" in window || "MozWebSocket" in window;
    if (!supportsWebSocket) {
        throw new Error("Browser doesn't support WebSocket connections.");
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
        throw new Error(`Socket closed with code ${event.code}`);
    };

    return socket;
}

/**
 * Fetches the user data from the Lanyard API
 * @param userId The user ID to fetch the data for
 * @returns The user data
 * @throws Error if the request failed
 */
export async function fetchUserData(userId: string): Promise<Data> {
    const res = await fetch(`${CONSTANTS.API_URL}/users/${userId}`);
    const body = await res.json();

    if (!body.success) {
        throw new Error(body.error?.message || "An invalid error occured");
    }

    return body.data;
}

/**
 * Fetches the user data from the Lanyard API for multiple users
 * @param userIds The user IDs to fetch the data for
 * @returns The user data
 * @throws Error if the request failed
 * @throws Error if the request failed for one of the users
 */
export async function fetchUserDataForMultipleUsers(userIds: string[]): Promise<Data[]> {
    const val: Data[] = [];

    for (const userId of userIds) {
        const res = await fetchUserData(userId);
        val.push(res);
    }

    return val;
}

/**
 * Fetches the user data KV from the Lanyard API
 * @param userId The user ID to fetch the data for
 * @param key The key to fetch the data for
 * @returns The user data KV
 * @throws Error if the request failed
 */
export async function getKV(userId: string, key: string): Promise<string> {
    try {
        const data = await fetchUserData(userId);
        return data.kv[key];
    } catch (err) {
        throw new Error(`Failed to get Lanyard KV for user ${userId} and key ${key}: ${err}`);
    }
}

/**
 * Sets the user data KV from the Lanyard API
 * @param userId The user ID to fetch the data for
 * @param key The key to fetch the data for
 * @param value The value to set
 * @param apiKey The API key to use
 * @throws Error if the request failed
 * @throws Error if the API key is invalid
 * @throws Error if the user ID is invalid
 */
export async function setKV(userId: string, key: string, value: any, apiKey: string): Promise<void> {
    const url = `${CONSTANTS.API_URL}/users/${userId}/kv/${key}`;
    const headers = {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify(value);

    const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: body
    });
    if (!response.ok) {
        throw new Error(`Failed to set Lanyard KV for user ${userId} and key ${key}: ${response.status} - ${await response.text()}`);
    }
}

/**
 * Merges the user data KV from the Lanyard API
 * @param userId The user ID to fetch the data for
 * @param kvPairs The key-value pairs to merge
 * @param apiKey The API key to use
 * @throws Error if the request failed
 * @throws Error if the API key is invalid
 * @throws Error if the user ID is invalid
 * @throws Error if the key-value pairs are invalid
 */
export async function mergeKV(userId: string, kvPairs: {[key: string]: any}, apiKey: string): Promise<void> {
    const url = `${CONSTANTS.API_URL}/users/${userId}/kv`;
    const headers = {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify(kvPairs);

    const response = await fetch(url, {
        method: 'PATCH',
        headers: headers,
        body: body
    });
    if (!response.ok) {
        throw new Error(`Failed to merge Lanyard KV for user ${userId}: ${response.status} - ${await response.text()}`);
    }
}

/**
 * Deletes the user data KV from the Lanyard API
 * @param userId The user ID to fetch the data for
 * @param key The key to fetch the data for
 * @param apiKey The API key to use
 * @throws Error if the request failed
 * @throws Error if the API key is invalid
 * @throws Error if the user ID is invalid
 * @throws Error if the key is not set
 */
export async function deleteKV(userId: string, key: string, apiKey: string): Promise<void> {
    const url = `${CONSTANTS.API_URL}/users/${userId}/kv/${key}`;
    const headers = {
        'Authorization': apiKey
    };

    const response = await fetch(url, {
        method: 'DELETE',
        headers: headers
    });
    if (!response.ok) {
        throw new Error(`Failed to delete Lanyard KV for user ${userId} and key ${key}: ${response.status} - ${await response.text()}`);
    }
}
