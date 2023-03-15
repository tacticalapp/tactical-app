import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", {
    __is_electron: true,
    platform: process.platform
});
