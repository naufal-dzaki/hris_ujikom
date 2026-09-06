"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Loader2, CheckCircle2, RefreshCcw, Wand2, MapPin, AlertTriangle } from "lucide-react";
import { useState, useEffect, useActionState, useRef, startTransition } from "react";
import { submitAttendanceAction } from "@/actions/attendance";

export function AttendanceForm() {
  // const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  // const [locationError, setLocationError] = useState("");
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(submitAttendanceAction, undefined);

  useEffect(() => {
    /*
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => {
          setLocationError("GPS diblokir sistem.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } 
      );
    }
    */
    return () => stopCamera();
  }, []);

  const useSimulationData = () => {
    // setLocation({ lat: -7.3328, lng: 112.7876 });
    // setLocationError("");

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#e2e8f0'; 
      ctx.fillRect(0, 0, 400, 400);
      
      ctx.fillStyle = '#334155'; 
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📸 Foto Simulasi (Bypass)', 200, 200);
      
      setPhotoPreview(canvas.toDataURL('image/jpeg'));
    }
  };

  const startCamera = async () => {
    setPhotoPreview(null);
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Gagal mengakses kamera! Pastikan izin kamera diberikan.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      setPhotoPreview(dataUrl);
      stopCamera();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    if (submitter && submitter.name) {
      formData.set(submitter.name, submitter.value);
    }

    if (photoPreview) {
      fetch(photoPreview)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          formData.set("photo", file);
          startTransition(() => formAction(formData));
        });
    }
  };

  if (state?.ok) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-700">Berhasil!</h3>
            <p className="text-sm text-green-600">{state.data}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>Absen Lagi</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Absensi</CardTitle>
        <CardDescription>Pilih jenis absen dan ambil foto selfie kehadiran.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          
          {state?.ok === false && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
              {state.error}
            </div>
          )}

          {/* <input type="hidden" name="latitude" value={location?.lat || ""} /> */}
          {/* <input type="hidden" name="longitude" value={location?.lng || ""} /> */}

          
          {/* <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <MapPin className={`w-5 h-5 ${location ? "text-green-500" : "text-amber-500"}`} />
              <div className="text-sm">
                {location && !locationError ? (
                  <span className="text-green-600 font-medium">
                    Lokasi: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> {locationError || "Mencari lokasi GPS..."}
                  </span>
                )}
              </div>
            </div>
          </div>  */}
         

          <div className="space-y-3">
            <label className="block text-sm font-medium">Foto Selfie Kehadiran</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 gap-4 bg-muted/30">
              
              <div className={`${isCameraActive ? 'block' : 'hidden'} w-full max-w-sm rounded-xl overflow-hidden shadow-sm border`}>
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto transform scale-x-[-1]"></video>
              </div>

              {photoPreview && !isCameraActive && (
                <img src={photoPreview} alt="Preview" className="w-full max-w-sm h-auto object-cover rounded-xl shadow-sm border transform scale-x-[-1]" />
              )}

              {!isCameraActive && !photoPreview && (
                <div className="w-48 h-48 bg-muted rounded-xl flex flex-col items-center justify-center text-muted-foreground text-center p-4">
                  <Camera className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-xs">Preview Foto</span>
                </div>
              )}
              
              <div>
                {!isCameraActive && !photoPreview && (
                  <Button type="button" onClick={startCamera} variant="secondary">
                    <Camera className="w-4 h-4 mr-2" /> Buka WebCam
                  </Button>
                )}
                
                {isCameraActive && (
                  <Button type="button" onClick={capturePhoto} className="bg-blue-600 hover:bg-blue-700">
                    <Camera className="w-4 h-4 mr-2" /> Ambil Foto Sekarang
                  </Button>
                )}

                {photoPreview && !isCameraActive && (
                  <Button type="button" onClick={startCamera} variant="secondary">
                    <RefreshCcw className="w-4 h-4 mr-2" /> Foto Ulang
                  </Button>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" name="type" value="MASUK" 
              className="flex-1 bg-blue-600 hover:bg-blue-700" 
              disabled={isPending || !photoPreview}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Masuk
            </Button>
            <Button 
              type="submit" name="type" value="PULANG" variant="destructive" className="flex-1" 
              disabled={isPending || !photoPreview}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Pulang
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}