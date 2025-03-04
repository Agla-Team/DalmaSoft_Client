import React, { useEffect, useState, useRef, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LicensePlateViewer from './licencePlateViewer';
import { VehiclesContext } from '@/hooks/useVehicles';

const backUrl = import.meta.env.VITE_BACKEND_URL;

const LicensePlateReader = ({ onPlateConfirm, onReset }) => {
  const [image, setImage] = useState(null);
  const [plateNumber, setPlateNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const { getVehicleFromEntity, vehicleByEntity } = useContext(VehiclesContext);
  

  

  // Stato per gestire l'inserimento manuale
  const [manualInputActive, setManualInputActive] = useState(false);
  const [manualPlate, setManualPlate] = useState('');

  // Controlla se l'utente sta usando il telefono
  const [isMobile, setIsMobile] = useState(false);

  // Inizializza i ref in modo esplicito
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Effetto per garantire che il ref sia pronto e il componente sia completamente montato
  useEffect(() => {
    const videoElement = videoRef.current;
    console.log("Component mounted, video element:", videoElement ? "disponibile" : "non disponibile");
  }, []);

  useEffect(() => {
    const checkIfMobileOrTablet = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024; // Consideriamo tablet sotto 1024px
      setIsMobile(isTouchDevice && isSmallScreen);
    };
  
    checkIfMobileOrTablet();
    window.addEventListener("resize", checkIfMobileOrTablet);
  
    return () => window.removeEventListener("resize", checkIfMobileOrTablet);
  }, []);

  const startCamera = async () => {
    setCameraActive(true);
    setTimeout(async () => {
      try {
        if (!videoRef.current) {
          console.error("Elemento video non trovato dopo il ritardo");
          setError('Elemento video non trovato. Riprova.');
          setCameraActive(false);
          return;
        }
        console.log("Richiedo accesso alla fotocamera...");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        console.log("Accesso alla fotocamera ottenuto, stream:", stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        } else {
          stream.getTracks().forEach(track => track.stop());
          setError('Elemento video non disponibile. Riprova.');
          setCameraActive(false);
        }
      } catch (err) {
        console.error('Errore fotocamera:', err);
        setError('Errore nell\'accesso alla fotocamera: ' + err.message);
        setCameraActive(false);
      }
    }, 500);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if(videoRef.current) videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    console.log("Funzione capturePhoto chiamata");
    if (!videoRef.current) {
      console.error("videoRef.current è null");
      setError("Impossibile acquisire l'immagine: riferimento al video non disponibile");
      return;
    }
    if (!canvasRef.current) {
      console.error("canvasRef.current è null");
      setError("Impossibile acquisire l'immagine: riferimento al canvas non disponibile");
      return;
    }
    try {
      console.log("Acquisizione dell'immagine dal video...");
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      console.log(`Dimensioni video originali: ${videoWidth}x${videoHeight}`);
      if (videoWidth === 0 || videoHeight === 0) {
        console.error("Dimensioni video non valide");
        setError("Impossibile acquisire l'immagine: flusso video non valido");
        return;
      }
      const targetRect = document.getElementById('target-rect');
      if (!targetRect) {
        console.error("Elemento rettangolo guida non trovato");
        setError("Impossibile acquisire l'immagine: riferimento al rettangolo non disponibile");
        return;
      }
      const rectBounds = targetRect.getBoundingClientRect();
      const videoBounds = video.getBoundingClientRect();
      const relativeLeft = rectBounds.left - videoBounds.left;
      const relativeTop = rectBounds.top - videoBounds.top;
      const scaleX = videoWidth / videoBounds.width;
      const scaleY = videoHeight / videoBounds.height;
      const sourceX = Math.max(0, relativeLeft * scaleX);
      const sourceY = Math.max(0, relativeTop * scaleY);
      const sourceWidth = Math.min(videoWidth, rectBounds.width * scaleX);
      const sourceHeight = Math.min(videoHeight, rectBounds.height * scaleY);
      console.log(`Area di ritaglio nel video: x=${sourceX}, y=${sourceY}, w=${sourceWidth}, h=${sourceHeight}`);
      const targetWidth = Math.min(800, sourceWidth);
      const targetHeight = Math.min(600, sourceHeight);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(
        video,
        sourceX, sourceY,
        sourceWidth, sourceHeight,
        0, 0,
        targetWidth, targetHeight
      );
      console.log("Area ritagliata disegnata sul canvas");
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      console.log("Immagine convertita in URL base64");
      setImage(imageDataUrl);
      console.log("Immagine salvata nello stato");
      stopCamera();
      console.log("Fotocamera fermata");
      setIsLoading(true);
      await analyzeImageData(imageDataUrl);
    } catch (err) {
      console.error("Errore durante la cattura della foto:", err);
      setError("Errore durante l'acquisizione: " + err.message);
      setIsLoading(false);
    }
  };

  const FullscreenCamera = () => {
    const rectWidth = '80%';
    const rectHeight = '120px';
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="relative flex-grow flex items-center justify-center bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div id="target-rect" 
              className="relative border-2 border-yellow-400 rounded-md z-10 flex items-center justify-center"
              style={{ width: rectWidth, height: rectHeight }}>
            <div className="absolute inset-0 border-4 border-dashed border-yellow-400 rounded-md opacity-70"></div>
            <p className="text-yellow-400 font-bold text-center bg-black bg-opacity-50 p-2 rounded">
              Centra la targa qui
            </p>
          </div>
        </div>
        <div className="bg-black p-4 flex justify-between">
          <Button 
            variant="destructive" 
            className="w-5/12 py-6 bg-slate-800 text-white font-bold" 
            onClick={stopCamera}
          >
            ANNULLA
          </Button>
          <Button 
            className="w-5/12 py-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold" 
            onClick={capturePhoto}
          >
            ACQUISISCI
          </Button>
        </div>
      </div>
    );
  };

  const analyzeImageData = async (imageData) => {
    try {
      console.log("Invio immagine al server per analisi...");
      const base64Image = imageData.split(',')[1];
      const response = await fetch(`${backUrl}/api/plate_scanner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: base64Image
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore dal server: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      console.log("Risposta dal server:", data);
      if (data.plateNumber) {
        setPlateNumber(data.plateNumber);
        console.log("Targa grezza riconosciuta:", data.rawPlateNumber);
        console.log("Targa corretta:", data.plateNumber);
      } else if (data.error) {
        setError(`Errore: ${data.error}`);
      } else {
        setError('Nessuna targa rilevata');
      }
    } catch (err) {
      console.error('Errore durante l\'analisi:', err);
      setError('Errore durante l\'analisi: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualInput = () => {
    setManualInputActive(true);
    setImage(null);
    setPlateNumber('');
    setError('');
  };
  
  const confirmManualPlate = () => {
    if (!manualPlate.trim()) {
      setError('Inserisci una targa valida');
      return;
    }
    let formattedPlate = manualPlate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (formattedPlate.length >= 3) {
      formattedPlate = formattedPlate.slice(0, 2) + ' ' + formattedPlate.slice(2);
    }
    setPlateNumber(formattedPlate);
    setManualPlate('');
  };
  
  
  const resetAll = () => {
    setImage(null);
    setPlateNumber('');
    setError('');
    setManualInputActive(false);
    setManualPlate('');
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <canvas ref={canvasRef} className="hidden" />
      {cameraActive && <FullscreenCamera />}
      {!cameraActive && (
        <div className="w-full">
          <div className="mb-4">
            {!image && !isLoading && !manualInputActive && !plateNumber && (
              <div className="auto-grid">
                <Button 
                  variant="default" 
                  className="bg-yellow-600 text-black"
                  onClick={startCamera}
                >
                  Scatta Foto
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-slate-800 text-white"
                  onClick={handleManualInput}
                >
                  Inserisci Manualmente
                </Button>
              </div>
            )}
            
            {manualInputActive && !plateNumber && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Inserisci la targa (es. AB123CD)"
                    value={manualPlate}
                    onChange={(e) => setManualPlate(e.target.value)}
                    className="flex-1"
                    maxLength="7"
                  />
                  <Button 
                    onClick={confirmManualPlate}
                    disabled={!manualPlate.trim()}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Conferma
                  </Button>
                </div>
                <Button 
                  variant="outline"
                  className="w-full bg-slate-800 text-white"
                  onClick={resetAll}
                >
                  Annulla
                </Button>
              </div>
            )}
            
            {isLoading && (
              <div className="w-full py-6 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Analisi targa in corso...</p>
              </div>
            )}
            
            {plateNumber && (
              <div className="space-y-4">
                <LicensePlateViewer plateNumber={plateNumber} />
                <Button 
                  variant="default"
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                  onClick={() => {
                    console.log('premuto pulsante');
                    getVehicleFromEntity('targa', plateNumber.trim().replace(' ', ''));
                  }}
                  //disabled={isLoading}
                >
                  Cerca Veicolo con Questa Targa
                </Button>
                <Button 
                  variant="outline"
                  className="w-full bg-slate-800 text-white"
                  onClick={resetAll}
                >
                  Nuova Targa
                </Button>
              </div>
            )}
            
            {image && !isLoading && (
              <div className="w-full mt-4">
                <img src={image} alt="Immagine targa" className="w-full border border-gray-300 rounded" />
              </div>
            )}
          </div>
          
          {error && (
            <div className="w-full p-3 bg-red-100 border border-red-300 text-red-700 rounded mb-4">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LicensePlateReader;
