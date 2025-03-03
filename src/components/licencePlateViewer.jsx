import React from 'react';

const LicensePlateViewer = ({ plateNumber }) => {
  // Verifica se la targa è presente
  const hasPlate = plateNumber && plateNumber.trim().length > 0;
  
  return (
    <div className="w-full max-w-md mx-auto my-4">
      <div className="relative aspect-[5/1] overflow-hidden rounded-md border-2 border-gray-800 shadow-lg">
        {/* Sfondo bianco della targa */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Banda blu sinistra con stelle UE */}
        <div class="absolute left-0 top-0 bottom-0 w-[12%] bg-blue-700 flex flex-col items-center justify-end py-1">
          <div class="text-white font-bold text-4xl mb-2">I</div>
        </div>
        
        {/* Banda blu destra con cerchio */}
        <div className="absolute right-0 top-0 bottom-0 w-[12%] bg-blue-700 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-yellow-400"></div>
        </div>
        
        {/* Area centrale per il numero di targa */}
        <div className="absolute top-0 bottom-0 left-[12%] right-[12%] flex items-center justify-center">
          {hasPlate ? (
            <div className="text-black font-bold text-4xl tracking-wider font-mono">
              {plateNumber}
            </div>
          ) : (
            <div className="text-gray-400 text-lg">Nessuna targa riconosciuta</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LicensePlateViewer;