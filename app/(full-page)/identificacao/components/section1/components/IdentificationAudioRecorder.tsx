import { useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';

interface IdentificationAudioRecorderProps {
    audio: File | null;
    onAudioChange: (audio: File | null) => void;
}

export function IdentificationAudioRecorder({ audio, onAudioChange }: IdentificationAudioRecorderProps) {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!audio) {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }

            setAudioUrl(null);
            setIsPlayingAudio(false);
        }
    }, [audio, audioUrl]);

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    const clearAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }

        setAudioUrl(null);
        setIsPlayingAudio(false);
        onAudioChange(null);
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioChunksRef.current = [];

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

            const audioFile = new File([audioBlob], `audio-${Date.now()}.webm`, {
                type: 'audio/webm'
            });

            const url = URL.createObjectURL(audioBlob);

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }

            setAudioUrl(url);
            onAudioChange(audioFile);

            stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const handlePlayAudio = () => {
        if (!audioRef.current) {
            return;
        }

        if (isPlayingAudio) {
            audioRef.current.pause();
            setIsPlayingAudio(false);
            return;
        }

        audioRef.current.play();
        setIsPlayingAudio(true);
    };

    return (
        <div className="border-1 surface-border border-round-xl p-3 h-full flex flex-column">
            <div className="flex align-items-center gap-2 mb-3">
                <span className="identification-section1__mini-step">2</span>
                <strong>Áudio opcional</strong>
            </div>

            <div className="flex flex-column align-items-center justify-content-center text-center gap-2 border-1 border-dashed border-green-200 border-round-xl surface-50 p-4 flex-1 min-h-12rem">
                {!audioUrl && (
                    <>
                        <i className="pi pi-volume-up text-4xl text-green-600" />

                        <strong className="text-900">Nenhum áudio gravado</strong>

                        <span className="text-500 text-sm">Grave um relato opcional sobre o animal</span>
                    </>
                )}

                {audioUrl && (
                    <>
                        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlayingAudio(false)} />

                        <Button type="button" icon={isPlayingAudio ? 'pi pi-pause' : 'pi pi-play'} rounded severity="success" className="identification-section1__play" onClick={handlePlayAudio} />

                        <div className="identification-section1__wave flex align-items-center justify-content-center gap-1 w-full">
                            {[12, 18, 24, 14, 28, 20, 16, 26, 18, 22, 14, 24, 20, 16, 28].map((height, index) => (
                                <span key={index} style={{ height: `${height}px` }} />
                            ))}
                        </div>

                        <strong className="text-900">Áudio gravado</strong>

                        <Button type="button" label="Remover áudio" icon="pi pi-trash" severity="danger" outlined size="small" onClick={clearAudio} />
                    </>
                )}
            </div>

            <Button
                type="button"
                label={isRecording ? 'Parar gravação' : audioUrl ? 'Gravar novo áudio' : 'Gravar áudio'}
                icon={isRecording ? 'pi pi-stop' : 'pi pi-microphone'}
                outlined={!isRecording}
                severity="success"
                className="w-full mt-3"
                onClick={handleToggleRecording}
            />

            <small className="text-center text-500 mt-3 block">Formatos: MP3, WAV, M4A</small>
        </div>
    );
}
