import { getItem, removeItem, setItem } from "@/utils";
import { LocalStore } from "./localStore";

export enum Channel {
    clearStore = "clear_store",
    exportStore = "export_store_data",
    importStore = "import_store_data",
    loadStore = "load_store_data",
    setStoreValue = "set_store_value",
}

export type SetStoreValuePayload<K extends keyof LocalStore> = {
    key: K;
    state: LocalStore[K];
};

export interface ChannelAPI {
    get(channel: string): any; // Define the return type as needed
    remove(channel: string): void;
    send(channel: string, payload?: any): void;
}

export const StoreAPI: ChannelAPI = {
    get: function (channel: string) {
        throw new Error("Function not implemented.");
    },
    remove: function (channel: string): void {
        throw new Error("Function not implemented.");
    },
    send: function (channel: string, payload?: any): void {
        throw new Error("Function not implemented.");
    }
};

/*async get(channel: string) {
        return await  getItem(channel);
    },
    async remove(channel: string) {
       await removeItem(channel);
    },
    async send(channel: string, payload?: any) {
      await setItem(channel, payload);
    },*/