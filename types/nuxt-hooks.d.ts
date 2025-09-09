import type { HookResult } from "nuxt/schema";

declare module "#app" {
  interface RuntimeNuxtHooks {
    snackIt: (error: unknown) => HookResult;
    waitDialog: (open: boolean) => HookResult;
    setHeader: (theTitle: string) => HookResult;
    openDrawer: () => HookResult;
  }
}
