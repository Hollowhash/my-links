"""Musik dan efek suara disintesis sendiri, jadi bebas hak cipta.

Bagian musik mengikuti timeline.json:
  0 .. tension_end   : nada rendah yang menahan, terasa tegang
  .. groove_end      : beat lo-fi tenang untuk bagian penjelasan
  .. break_end       : pad saja, memberi ruang untuk kalimat penting
  .. selesai         : lebih terang, untuk penutup

Pakai: python3 make_audio.py ../../remotion/src/timeline.json
"""
import json
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
BPM = 84
KETUK = 60.0 / BPM


def lpf(x, hz, order=4):
    return sosfilt(butter(order, hz / (SR / 2), btype="low", output="sos"), x)


def hpf(x, hz, order=4):
    return sosfilt(butter(order, hz / (SR / 2), btype="high", output="sos"), x)


def bpf(x, lo, hi, order=4):
    return sosfilt(butter(order, [lo / (SR / 2), hi / (SR / 2)], btype="band", output="sos"), x)


def env(n, serang=0.01, luruh=0.3, tahan=0.6, lepas=0.3):
    a = int(serang * SR)
    d = int(luruh * SR)
    r = int(lepas * SR)
    s = max(0, n - a - d - r)
    return np.concatenate([
        np.linspace(0, 1, a, endpoint=False),
        np.linspace(1, tahan, d, endpoint=False),
        np.full(s, tahan),
        np.linspace(tahan, 0, n - a - d - s),
    ])[:n]


def nada(f, dur, bentuk="sine", detune=0.0):
    t = np.arange(int(dur * SR)) / SR
    f = f * (1 + detune)
    if bentuk == "saw":
        x = 2 * (t * f - np.floor(0.5 + t * f))
    elif bentuk == "tri":
        x = 2 * np.abs(2 * (t * f - np.floor(0.5 + t * f))) - 1
    else:
        x = np.sin(2 * np.pi * f * t)
    return x


def taruh(buf, x, at):
    i = int(at * SR)
    n = min(len(x), len(buf) - i)
    if n > 0 and i >= 0:
        buf[i:i + n] += x[:n]


def kick(dur=0.42):
    t = np.arange(int(dur * SR)) / SR
    f = 118 * np.exp(-t * 26) + 46
    x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return x * np.exp(-t * 7.5) * 0.9


def snare(dur=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    derau = bpf(np.random.randn(n), 900, 5200) * np.exp(-t * 15)
    badan = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 22) * 0.4
    return (derau * 0.5 + badan) * 0.5


def hat(dur=0.09):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return hpf(np.random.randn(n), 7000) * np.exp(-t * 48) * 0.16


def pad(akor, dur, keras=0.14):
    n = int(dur * SR)
    x = np.zeros(n)
    for f in akor:
        for d in (-0.004, 0.0, 0.005):
            x += nada(f, dur, "saw", d)[:n] * 0.33
    x = lpf(x, 1500)
    return x * env(n, 0.5, 0.6, 0.85, 0.9) * keras


def petik(f, dur=0.9, keras=0.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 3.4)
    return lpf(x, 3200) * keras


N = {"A2": 110.0, "C3": 130.8, "E3": 164.8, "F2": 87.3, "G2": 98.0,
     "A3": 220.0, "C4": 261.6, "E4": 329.6, "F3": 174.6, "G3": 196.0, "D4": 293.7}
PROG = [
    [N["A2"], N["A3"], N["C4"], N["E4"]],
    [N["F2"], N["F3"], N["A3"], N["C4"]],
    [N["C3"], N["C4"], N["E4"], N["G3"]],
    [N["G2"], N["G3"], N["D4"], N["E4"]],
]


def buat_musik(total, tension_end, groove_end, break_end):
    n = int(total * SR)
    buf = np.zeros(n)

    # Nada rendah yang menahan di awal
    t = np.arange(int(tension_end * SR)) / SR
    drone = (np.sin(2 * np.pi * 55 * t) * 0.5 + np.sin(2 * np.pi * 110.5 * t) * 0.22)
    drone *= np.linspace(0.2, 0.85, len(t)) ** 1.5
    denyut = np.zeros(len(t))
    for k in range(int(tension_end / (KETUK * 2))):
        taruh(denyut, kick(0.5) * 0.5, k * KETUK * 2)
    taruh(buf, lpf(drone + denyut, 420) * 0.5, 0)

    # Akor berjalan sepanjang sisa video
    batang = KETUK * 4
    i = 0
    at = tension_end
    while at < total:
        akor = PROG[i % 4]
        keras = 0.16 if at < break_end else 0.2
        taruh(buf, pad(akor, batang * 1.05, keras), at)
        if at < groove_end or at >= break_end:
            for k in range(4):
                taruh(buf, kick() * 0.5, at + k * KETUK)
                if k % 2 == 1:
                    taruh(buf, snare(), at + k * KETUK)
                taruh(buf, hat(), at + k * KETUK)
                taruh(buf, hat() * 0.7, at + k * KETUK + KETUK / 2)
        else:
            taruh(buf, petik(akor[2] * 2, 1.2, 0.12), at)
            taruh(buf, petik(akor[3] * 2, 1.1, 0.09), at + batang / 2)
        at += batang
        i += 1

    return buf


def swoosh(dur=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    derau = np.random.randn(n)
    sapu = bpf(derau, 420, 7200) * (np.exp(-t * 7) * np.sin(np.pi * t / dur) ** 0.5)
    return sapu * 0.5


def tulis(path, x):
    x = np.tanh(x * 1.1) * 0.92
    wavfile.write(path, SR, (x * 32767).astype(np.int16))


if __name__ == "__main__":
    tl = json.load(open(sys.argv[1]))
    m = tl["music"]
    musik = buat_musik(tl["total"], m["tension_end"], m["groove_end"], m["break_end"])
    tulis("music_raw.wav", musik)
    tulis("swoosh.wav", swoosh())
    print(f"music_raw.wav ({tl['total']:.1f} detik) dan swoosh.wav siap")
