import mitt from 'mitt';
import type { Emitter } from 'mitt';

export default defineNuxtPlugin(() => {
    type Events = {
        'wait-dialog': boolean;
        'error-snackbar': unknown;
        'success-snackbar': string;
        'open-drawer': undefined;
        'set-header': string;
    };
    const emitter: Emitter<Events> = mitt<Events>();

    return {
        provide: {
            bus: {
                $on: emitter.on,
                $emit: emitter.emit,
                $off: emitter.off
            },
        },
    };
});