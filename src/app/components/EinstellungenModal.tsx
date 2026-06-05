import React from 'react';
import EinstellungenView from './EinstellungenView';

type Schwere    = 'leicht' | 'mittel' | 'schwer';
type Bekleidung = 'leicht' | 'mittel' | 'schwer';
interface Ort { id: number; name: string; city: string; lat?: number; lng?: number; }

interface EinstellungenModalProps {
  onClose: () => void;
  startZeit: string; setStartZeit: (v: string) => void;
  endZeit: string;   setEndZeit:   (v: string) => void;
  orte: Ort[];       setOrte:      React.Dispatch<React.SetStateAction<Ort[]>>;
  aktiveOrtId: number | null; setAktiveOrtId: (id: number | null) => void;
  schwere: Schwere;       setSchwere:    (v: Schwere) => void;
  bekleidung: Bekleidung; setBekleidung: (v: Bekleidung) => void;
}

export default function EinstellungenModal({
  onClose,
  startZeit, setStartZeit,
  endZeit, setEndZeit,
  orte, setOrte,
  aktiveOrtId, setAktiveOrtId,
  schwere, setSchwere,
  bekleidung, setBekleidung,
}: EinstellungenModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="modal-backdrop absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="modal-panel absolute inset-0 overflow-y-auto lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[640px] lg:shadow-2xl">
        <EinstellungenView
          startZeit={startZeit}
          setStartZeit={setStartZeit}
          endZeit={endZeit}
          setEndZeit={setEndZeit}
          orte={orte}
          setOrte={setOrte}
          aktiveOrtId={aktiveOrtId}
          setAktiveOrtId={setAktiveOrtId}
          schwere={schwere}
          setSchwere={setSchwere}
          bekleidung={bekleidung}
          setBekleidung={setBekleidung}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
