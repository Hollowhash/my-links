"""Susun jalur efek suara (swoosh tiap ganti scene + ambience tipis).

Pakai: python3 mix.py ../../remotion/src/timeline.json [swoosh.mp3]
Kalau file swoosh tidak diberikan atau tidak ada, dipakai swoosh sintetis.
"""
import json
import os
import subprocess
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000


def baca(path):
    keluar = "tmp_in.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(SR), keluar], check=True)
    sr, x = wavfile.read(keluar)
    os.remove(keluar)
    return x.astype(np.float32) / 32768


def taruh(buf, x, at):
    i = int(at * SR)
    n = min(len(x), len(buf) - i)
    if n > 0 and i >= 0:
        buf[i:i + n] += x[:n]


if __name__ == "__main__":
    tl = json.load(open(sys.argv[1]))
    sumber = sys.argv[2] if len(sys.argv) > 2 else None
    sw = baca(sumber) if sumber and os.path.exists(sumber) else baca("swoosh.wav")

    n = int(tl["total"] * SR)
    bus = np.zeros(n, dtype=np.float32)
    for s in tl["sfx"]:
        if s["jenis"] == "swoosh" and s["at"] > 0:
            taruh(bus, sw * 0.5, s["at"])

    # Ambience: desis ruangan yang sangat pelan supaya tidak terasa hampa.
    for a in tl.get("ambience", []):
        panjang = int((a["sampai"] - a["dari"]) * SR)
        derau = np.random.randn(panjang).astype(np.float32)
        derau = sosfilt(butter(4, [120 / (SR / 2), 1800 / (SR / 2)], btype="band", output="sos"), derau)
        taruh(bus, derau * a["volume"] * 0.25, a["dari"])

    slug = tl.get("slug", "ep")
    wavfile.write(f"sfx_{slug}.wav", SR, (np.tanh(bus) * 0.9 * 32767).astype(np.int16))
    print(f"sfx_{slug}.wav siap ({tl['total']:.1f} detik, {len(tl['sfx'])} swoosh)")
