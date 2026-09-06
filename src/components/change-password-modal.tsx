"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { useState, useActionState, FormEvent, useRef, useEffect } from "react";
import { changePasswordAction } from "@/actions/user";
import { ChangePasswordSchema } from "@/schemas/user";

export function ChangePasswordModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [clientErrors, setClientErrors] = useState<{ [key: string]: string[] }>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(changePasswordAction, undefined);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData);
    const validated = ChangePasswordSchema.safeParse(rawData);

    if (!validated.success) {
      e.preventDefault();
      setClientErrors(validated.error.flatten().fieldErrors);
    } else {
      setClientErrors({});
    }
  };

  useEffect(() => {
    if (state?.ok) {
      setIsOpen(false); 
      formRef.current?.reset(); 
      setClientErrors({}); 
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [state]);

  const currentPasswordError = clientErrors.currentPassword?.[0] || (state?.ok === false ? state.fieldErrors?.currentPassword?.[0] : null);
  const newPasswordError = clientErrors.newPassword?.[0] || (state?.ok === false ? state.fieldErrors?.newPassword?.[0] : null);
  const confirmPasswordError = clientErrors.confirmPassword?.[0] || (state?.ok === false ? state.fieldErrors?.confirmPassword?.[0] : null);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="w-full">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
            <DialogDescription>
              Perbarui password Anda untuk menjaga keamanan akun.
            </DialogDescription>
          </DialogHeader>

          <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-5 mt-2">
            
            {state?.ok === false && state.error && !state.fieldErrors && (
               <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md text-center">
                 {state.error}
               </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <div className="relative mt-2.5">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    className="ps-9 pe-9"
                    placeholder="Masukkan password saat ini"
                    type={showCurrent ? "text" : "password"}
                    disabled={isPending}
                  />
                  <div className="text-muted-foreground/80 absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3">
                    <Lock size={16} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 inset-e-0 flex w-9 items-center justify-center focus:outline-none"
                    disabled={isPending}
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {currentPasswordError && <p className="text-sm font-medium text-destructive mt-1.5">{currentPasswordError}</p>}
              </div>

              <div>
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative mt-2.5">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    className="ps-9 pe-9"
                    placeholder="Masukkan password baru"
                    type={showNew ? "text" : "password"}
                    disabled={isPending}
                  />
                  <div className="text-muted-foreground/80 absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3">
                    <Lock size={16} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 inset-e-0 flex w-9 items-center justify-center focus:outline-none"
                    disabled={isPending}
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPasswordError && <p className="text-sm font-medium text-destructive mt-1.5">{newPasswordError}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative mt-2.5">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    className="ps-9 pe-9"
                    placeholder="Konfirmasi password baru"
                    type={showConfirm ? "text" : "password"}
                    disabled={isPending}
                  />
                  <div className="text-muted-foreground/80 absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3">
                    <Lock size={16} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 inset-e-0 flex w-9 items-center justify-center focus:outline-none"
                    disabled={isPending}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPasswordError && <p className="text-sm font-medium text-destructive mt-1.5">{confirmPasswordError}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Simpan Password"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}