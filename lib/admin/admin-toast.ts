import { toast } from "sonner";

const adminToastClass =
  "!bg-neutral-900 !text-white !border-neutral-700 !shadow-lg [&_[data-description]]:!text-neutral-300";

export const adminToast = {
  success(message: string) {
    toast.success(message, { className: adminToastClass });
  },
  error(message: string) {
    toast.error(message, { className: adminToastClass });
  },
  info(message: string) {
    toast.info(message, { className: adminToastClass });
  },
};
