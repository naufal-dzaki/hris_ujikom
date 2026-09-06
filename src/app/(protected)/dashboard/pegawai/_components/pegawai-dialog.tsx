"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { savePegawaiAction } from "@/actions/pegawai";
import { Loader2, Plus } from "lucide-react";

export function PegawaiDialog({ 
  pegawai, 
  departments, 
  positions, 
  trigger 
}: { 
  pegawai?: any, 
  departments: any[], 
  positions: any[], 
  trigger?: React.ReactNode 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(savePegawaiAction, undefined);

  useEffect(() => {
    if (state?.ok) {
      setIsOpen(false);
    }
  }, [state]);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="inline-block cursor-pointer">
        {trigger || (
          <Button type="button" className="pointer-events-none">
            <Plus className="w-4 h-4 mr-2" /> Tambah Pegawai
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{pegawai ? "Edit Data Pegawai" : "Tambah Pegawai Baru"}</DialogTitle>
          </DialogHeader>
          <form ref={formRef} action={formAction} className="space-y-4 mt-2">
            {state?.ok === false && state.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{state.error}</div>
            )}
            {pegawai && <input type="hidden" name="id" value={pegawai.id} />}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NIP</Label>
                <Input name="nip" defaultValue={pegawai?.nip || ""} required />
                {state?.ok === false && state.fieldErrors?.nip && <p className="text-xs text-red-500">{state.fieldErrors.nip[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input name="name" defaultValue={pegawai?.name || ""} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" defaultValue={pegawai?.email || ""} required />
              </div>
              <div className="space-y-2">
                <Label>Password {pegawai && "(Isi jika ingin diubah)"}</Label>
                <Input name="password" type="password" required={!pegawai} />
              </div>
              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <Select name="gender" defaultValue={pegawai?.gender || "LAKI_LAKI"}>
                  <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                    <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nomor HP</Label>
                <Input name="phone" defaultValue={pegawai?.phone || ""} />
              </div>
              <div className="space-y-2">
                <Label>Departemen</Label>
                <Select name="departmentId" defaultValue={pegawai?.departmentId?.toString()}>
                  <SelectTrigger><SelectValue placeholder="Pilih Departemen" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Select name="positionId" defaultValue={pegawai?.positionId?.toString()}>
                  <SelectTrigger><SelectValue placeholder="Pilih Jabatan" /></SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Simpan Data
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}