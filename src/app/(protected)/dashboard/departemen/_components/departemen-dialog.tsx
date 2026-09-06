"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveDepartemenAction } from "@/actions/departemen";
import { Loader2, Plus } from "lucide-react";

export function DepartemenDialog({ departemen, trigger }: { departemen?: any, trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(saveDepartemenAction, undefined);

  useEffect(() => {
    if (state?.ok) setIsOpen(false);
  }, [state]);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="inline-block cursor-pointer">
        {trigger || (
          <Button type="button" className="pointer-events-none">
            <Plus className="w-4 h-4 mr-2" /> Tambah Departemen
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{departemen ? "Edit Departemen" : "Tambah Departemen Baru"}</DialogTitle>
          </DialogHeader>
          <form ref={formRef} action={formAction} className="space-y-4 mt-2">
            {state?.ok === false && state.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{state.error}</div>
            )}
            
            {departemen && <input type="hidden" name="id" value={departemen.id} />}
            
            <div className="space-y-2">
              <Label>Nama Departemen</Label>
              <Input name="name" defaultValue={departemen?.name || ""} placeholder="Contoh: IT Support" required disabled={isPending} />
              {state?.ok === false && state.fieldErrors?.name && <p className="text-xs text-red-500">{state.fieldErrors.name[0]}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Simpan Data
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}