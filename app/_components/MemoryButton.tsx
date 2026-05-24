"use client";

import { useRef, useState, useTransition } from "react";
import {
  addMemoryAction,
  removeMemoryAction,
  updateCaptionAction,
} from "../_actions/memory";

type ExistingMemory = {
  photo: string;
  caption: string | null;
} | null;

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.85;

async function compressImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target!.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Could not decode image."));
    i.src = dataUrl;
  });

  let { width, height } = img;
  if (width > height && width > MAX_DIMENSION) {
    height = Math.round((height * MAX_DIMENSION) / width);
    width = MAX_DIMENSION;
  } else if (height > MAX_DIMENSION) {
    width = Math.round((width * MAX_DIMENSION) / height);
    height = MAX_DIMENSION;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export function MemoryButton({
  ideaKey,
  ideaText,
  ideaEmoji,
  memory,
}: {
  ideaKey: string;
  ideaText: string;
  ideaEmoji: string;
  memory: ExistingMemory;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState(memory?.caption ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openExisting() {
    setPreviewPhoto(memory?.photo ?? null);
    setCaption(memory?.caption ?? "");
    setError(null);
    setModalOpen(true);
  }

  function openNew() {
    setPreviewPhoto(null);
    setCaption("");
    setError(null);
    fileInputRef.current?.click();
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking same file later
    if (!file) return;

    setError(null);
    try {
      const compressed = await compressImage(file);
      setPreviewPhoto(compressed);
      setModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that photo.");
      setModalOpen(true);
    }
  }

  function onSave() {
    if (!previewPhoto) return;
    const captionToSend = caption.trim() || null;

    startTransition(async () => {
      const isNewPhoto = previewPhoto !== memory?.photo;
      const result = isNewPhoto
        ? await addMemoryAction(ideaKey, previewPhoto, captionToSend)
        : await updateCaptionAction(ideaKey, captionToSend);

      if ("error" in result) {
        setError(result.error);
        return;
      }
      setModalOpen(false);
    });
  }

  function onRemove() {
    startTransition(async () => {
      const result = await removeMemoryAction(ideaKey);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setModalOpen(false);
    });
  }

  function onReplace() {
    fileInputRef.current?.click();
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {memory ? (
        <button
          type="button"
          onClick={openExisting}
          className="mt-3 flex w-full items-center gap-3 rounded-xl border-2 border-ink bg-cream px-2 py-2 text-left transition hover:-translate-y-0.5 hover:bg-sun"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={memory.photo}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg border-2 border-ink object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="text-[0.7rem] font-black uppercase tracking-wider text-ink-soft">
              📸 your memory
            </div>
            <div className="truncate text-[0.85rem] font-bold text-ink">
              {memory.caption || "tap to add a caption"}
            </div>
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={openNew}
          className="mt-3 w-full rounded-xl border-2 border-dashed border-ink bg-white/60 px-3 py-2 text-[0.85rem] font-black text-ink-soft transition hover:-translate-y-0.5 hover:bg-sun hover:text-ink"
        >
          📷 add a photo
        </button>
      )}

      {modalOpen && (
        <Modal onClose={() => !pending && setModalOpen(false)}>
          <div className="mb-2 flex items-center gap-3">
            <div className="text-3xl" aria-hidden>
              {ideaEmoji}
            </div>
            <div>
              <div className="text-[0.7rem] font-black uppercase tracking-wider text-ink-soft">
                memory for
              </div>
              <div className="font-display text-xl font-black leading-tight">
                {ideaText}
              </div>
            </div>
          </div>

          {previewPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewPhoto}
              alt="preview"
              className="mt-3 max-h-[50vh] w-full rounded-xl border-[3px] border-ink object-contain"
            />
          ) : (
            <div className="mt-3 rounded-xl border-[3px] border-dashed border-ink bg-cream/40 p-8 text-center text-sm font-bold text-ink-soft">
              No photo yet.
            </div>
          )}

          <label className="mt-4 block text-[0.7rem] font-black uppercase tracking-wider text-ink-soft">
            caption (optional)
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={200}
            placeholder="best day ever 🌅"
            disabled={pending}
            className="mt-1 w-full rounded-xl border-[3px] border-ink bg-white px-3 py-2 text-[0.95rem] font-bold text-ink focus:outline-none focus:ring-2 focus:ring-coral"
          />

          {error && (
            <p className="mt-3 rounded-lg border-2 border-coral bg-coral/10 px-3 py-2 text-[0.85rem] font-bold text-coral">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={pending || !previewPhoto}
              className="rounded-xl border-[3px] border-ink bg-sun px-4 py-2 text-sm font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? "saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={onReplace}
              disabled={pending}
              className="rounded-xl border-[3px] border-ink bg-white px-4 py-2 text-sm font-black text-ink shadow-chunky-sm transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {memory ? "Replace photo" : "Pick photo"}
            </button>
            {memory && (
              <button
                type="button"
                onClick={onRemove}
                disabled={pending}
                className="ml-auto rounded-xl border-2 border-ink bg-transparent px-3 py-2 text-xs font-bold text-ink hover:bg-coral hover:text-white disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border-[3px] border-ink bg-cream p-6 shadow-chunky-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute right-3 top-3 h-8 w-8 rounded-lg border-2 border-ink bg-white text-base font-black hover:bg-coral hover:text-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
