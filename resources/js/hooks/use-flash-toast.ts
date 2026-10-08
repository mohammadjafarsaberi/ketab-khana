import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (data) {
                toast[data.type](data.message);
            }

            if (flash?.success) {
                toast.success(String(flash.success));
            }

            if (flash?.error) {
                toast.error(String(flash.error));
            }
        });
    }, []);
}
