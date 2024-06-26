import { EventEmitter } from 'events';

import { createHumanitecClient, fetchAppInfo, HumanitecResponseError } from '@humanitec/backstage-plugin-common';

const defaultFetchInterval = 10000;

export interface AppInfoUpdate {
    id: number;
    data?: any;
    error?: Error;
}

// This service is responsible for fetching app info from Humanitec on an interval and updating all subscribers.
//
// Subscribers aren't fetching app info directly because we want to avoid multiple requests for the same app info.
//
export class AppInfoService {
    private emitter: EventEmitter = new EventEmitter();
    private timeouts: Map<string, NodeJS.Timeout> = new Map();
    private lastData: Map<string, AppInfoUpdate> = new Map();

    private token: string;
    private fetchInterval: number;
    private client: ReturnType<typeof createHumanitecClient>;

    constructor(token: string, fetchInterval = defaultFetchInterval) {
        this.token = token;
        this.fetchInterval = fetchInterval;
        this.client = createHumanitecClient({ token: this.token });
    }

    addSubscriber(orgId: string, appId: string, subscriber: (data: AppInfoUpdate) => void): () => void {
        const key = `${orgId}:${appId}`;

        this.emitter.on(key, subscriber);

        // Only fetch app info if a fetch is not pending.
        if (!this.timeouts.has(key)) {
            this.timeouts.set(key, setTimeout(() => this.fetchAppInfo(orgId, appId), 1));
        } else {
            if (this.lastData.has(key)) {
                subscriber(this.lastData.get(key)!);
            }
        }

        // Return a function that removes this subscriber when it's no longer interested.
        return () => {
            this.emitter.off(key, subscriber);
            if (this.emitter.listenerCount(key) === 0 && this.timeouts.has(key)) {
                clearTimeout(this.timeouts.get(key)!);
                this.timeouts.delete(key);
                this.lastData.delete(key);
            }
        };
    }

    private async fetchAppInfo(orgId: string, appId: string): Promise<void> {
        const key = `${orgId}:${appId}`;

        const id = this.lastData.has(key) ? this.lastData.get(key)!.id + 1 : 0;

        const update: AppInfoUpdate = { id: id };
        try {
            const data = await fetchAppInfo({ client: this.client }, orgId, appId);
            update.data = data;
        } catch (error) {
            if (error instanceof HumanitecResponseError) {
                let msg = `Failed to fetch ${error.response.url} (${error.response.status})`;
                if (!error.response.bodyUsed) {
                    msg += `\n${await error.response.text()}`;
                }
                update.error = new Error(msg);
            } else if (error instanceof Error) {
                update.error = error;
            } else {
                update.error = new Error(`${error}`);
            }
        } finally {
            if (this.emitter.listenerCount(key) > 0) {
                this.timeouts.set(key, setTimeout(() => this.fetchAppInfo(orgId, appId), this.fetchInterval));
                this.lastData.set(key, update);
                this.emitter.emit(key, update);
            }
        }
    }
}
