import {useState} from 'react';
import {Lock, Key, Shield, Terminal, Cpu, Zap, AlertTriangle, CheckCircle, ArrowRight, Play, Github, Youtube} from 'lucide-react';

type Scene = {
  id: number;
  title: string;
  duration: string;
  icon: typeof Lock;
  color: string;
  description: string;
  caption: string;
};

const SCENES: Scene[] = [
  {id: 1, title: 'Key Generation', duration: '0:00–0:15', icon: Key, color: 'mint', description: 'Two prime blocks p and q slide in and merge into modulus n. Public key (n,e) and private key d form with lock and key icons.', caption: '> RSA is a public-key encryption scheme.'},
  {id: 2, title: 'Key Generation Math', duration: '0:15–0:30', icon: Key, color: 'mint', description: 'p×q=n, phi(n)=(p-1)(q-1), e chosen coprime to phi, d as modular inverse with an animated arc.', caption: '> The keys come from two large primes p and q.'},
  {id: 3, title: 'Encryption', duration: '0:30–0:45', icon: Lock, color: 'amber', description: 'Message M becomes an integer, raised to power e, trimmed by mod n gate, yielding ciphertext C.', caption: '> The ciphertext is C = M^e mod n.'},
  {id: 4, title: 'Decryption', duration: '0:45–1:00', icon: Key, color: 'mint', description: 'C raised to d, mod n gate trims, M restored, transforms back into readable "HELLO" in an envelope window.', caption: '> The recipient uses private key d to recover M.'},
  {id: 5, title: "Euler's Theorem", duration: '1:00–1:15', icon: Zap, color: 'amber', description: 'Circular cycle of powers mod 7: marker walks 5→4→6→2→3→1 showing 5^6 ≡ 1 (mod 7).', caption: '> This works by Eulers theorem.'},
  {id: 6, title: 'Multiplicative Group', duration: '1:15–1:30', icon: Shield, color: 'mint', description: 'Two overlapping circles p-1 and q-1 form phi(n). Number line with coprime/non-coprime dots. Exponent loop slider.', caption: '> Only numbers coprime to n form the group.'},
  {id: 7, title: 'Prime Generation', duration: '1:30–1:45', icon: Terminal, color: 'mint', description: 'Terminal scrolls candidate numbers, primality test strikes out composites, two finally glow PRIME.', caption: '> Finding large primes is computationally expensive.'},
  {id: 8, title: 'Fast Exponentiation', duration: '1:45–2:00', icon: Zap, color: 'amber', description: 'Naive 8 multiplications vs square-and-multiply 3 steps (a→a²→a⁴→a⁸), each through mod n filters.', caption: '> Square and multiply, three steps instead of eight.'},
  {id: 9, title: 'CRT Decryption', duration: '2:00–2:20', icon: Cpu, color: 'mint', description: 'C splits into two branches: mod p → C_p and mod q → C_q. Half-size exponents give ~4x speedup.', caption: '> Decryption sped up with the Chinese Remainder Theorem.'},
  {id: 10, title: 'Garner Recombination', duration: '2:20–2:40', icon: Cpu, color: 'mint', description: 'C_p and C_q feed into formula box. Steps light up: difference → ×inverse → ×q → +C_q → M.', caption: '> We recombine using Garners formula.'},
  {id: 11, title: 'CRT Exponent Reduction', duration: '2:40–2:55', icon: Cpu, color: 'mint', description: 'Exponent bars shrink from d to d_p (mod p-1) and d_q (mod q-1). Faster squaring loops spin.', caption: '> Each branch sped up by reducing the exponent.'},
  {id: 12, title: 'Key Size Security', duration: '2:55–3:10', icon: Shield, color: 'coral', description: 'Bar scale: 512-bit shattered, 1024-bit cracked, 2048+ locked. Crusher fails to break the large n block.', caption: '> RSA security comes from factoring hardness.'},
  {id: 13, title: 'Prime Selection Attacks', duration: '3:10–3:30', icon: AlertTriangle, color: 'coral', description: 'Saw splits n into p and q. Warnings for Fermat (p−q small) and Pollard (p−1 small factors). Strong primes chosen.', caption: '> Attackers try smarter math: factoring n.'},
  {id: 14, title: 'Side-Channel Attacks', duration: '3:30–3:45', icon: Cpu, color: 'coral', description: 'Clock + decryption chip. Time-vs-input graph with spikes leaking d. Guard adds jitter → flat timing.', caption: '> Timing attacks can leak bits of d.'},
  {id: 15, title: 'Chosen-Ciphertext / OAEP', duration: '3:45–4:00', icon: Shield, color: 'coral', description: 'Attacker multiplies C by 2^e, decrypter returns 2·M, divide by 2. OAEP shield blocks the attack.', caption: '> RSA is malleable under multiplication.'},
  {id: 16, title: 'Conclusion', duration: '4:00–4:10', icon: CheckCircle, color: 'mint', description: 'Number blocks converge into a vault lock. RSA title with checkmark. "Secure encryption" subtitle.', caption: '> RSA uses exponentiation with large prime-based keys.'},
];

const colorMap: Record<string, {bg: string; border: string; text: string; dot: string; glow: string} > = {
  mint: {bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/20'},
  amber: {bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400', glow: 'shadow-amber-500/20'},
  coral: {bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400', glow: 'shadow-rose-500/20'},
};

function App() {
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0d0b] text-[#e8e6df] font-mono">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-[#222719]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-9xl font-bold text-emerald-500/5 select-none">p</div>
          <div className="absolute top-20 right-20 text-9xl font-bold text-amber-500/5 select-none">q</div>
          <div className="absolute bottom-10 left-1/3 text-9xl font-bold text-rose-500/5 select-none">n</div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-sm tracking-[0.3em] text-[#5c655d] uppercase">Motion Canvas Explainer</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="text-[#e8e6df]">RSA</span>
            <span className="text-emerald-400"> Algorithm</span>
          </h1>
          <p className="text-xl text-[#8a9489] max-w-2xl mb-8 leading-relaxed">
            A cinematic visual journey through RSA encryption — from prime generation to CRT optimization,
            side-channel defenses, and OAEP padding. 16 scenes. ~4 minutes. Every step animated.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#11140f] border border-[#222719]">
              <Play className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">16 scenes</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#11140f] border border-[#222719]">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Live terminals</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#11140f] border border-[#222719]">
              <Shield className="w-4 h-4 text-rose-400" />
              <span className="text-sm">Security deep-dive</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#11140f] border border-[#222719]">
              <Youtube className="w-4 h-4 text-[#8a9489]" />
              <span className="text-sm">1920×1080 · 30fps</span>
            </div>
          </div>
        </div>
      </header>

      {/* Caption style preview */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-2">Stylized Captions</h2>
        <p className="text-[#8a9489] mb-8">Every narration beat has a timed subtitle — green chevron, 80% black rail, JetBrains Mono.</p>
        <div className="flex flex-col gap-3">
          {SCENES.slice(0, 4).map((s) => {
            const c = colorMap[s.color];
            return (
              <div key={s.id} className={`inline-flex items-center gap-3 self-start px-6 py-3 rounded-xl bg-[#0a0d0b]/80 border border-[#222719]`}>
                <span className="text-emerald-400 text-lg font-semibold">{`>`}</span>
                <span className="text-lg font-semibold text-[#e8e6df]">{s.caption.replace('> ', '')}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scene grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-2">All 16 Scenes</h2>
        <p className="text-[#8a9489] mb-8">Click any scene to see its caption and visual description.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCENES.map((scene) => {
            const c = colorMap[scene.color];
            const Icon = scene.icon;
            return (
              <button
                key={scene.id}
                onClick={() => setSelectedScene(scene)}
                className={`group text-left rounded-2xl ${c.bg} ${c.border} border p-5 hover:scale-[1.02] transition-all duration-200 hover:shadow-2xl ${c.glow}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <span className="text-xs text-[#5c655d] font-mono">{scene.duration}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-[#e8e6df]">{scene.title}</h3>
                <p className="text-sm text-[#8a9489] leading-relaxed line-clamp-2">{scene.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-[#5c655d]">
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span>Scene {scene.id}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tech stack */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-t border-[#222719]">
        <h2 className="text-2xl font-bold mb-8">Built With</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {label: 'Motion Canvas v3', icon: Play},
            {label: 'JetBrains Mono', icon: Terminal},
            {label: 'Lucide Icons', icon: Key},
            {label: 'House Style', icon: Shield},
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="flex items-center gap-3 px-5 py-4 rounded-xl bg-[#11140f] border border-[#222719]">
                <Icon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold">{t.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal */}
      {selectedScene && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
          onClick={() => setSelectedScene(null)}
        >
          <div
            className="max-w-2xl w-full rounded-2xl bg-[#11140f] border border-[#222719] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const c = colorMap[selectedScene.color];
                  const Icon = selectedScene.icon;
                  return (
                    <>
                      <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${c.text}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedScene.title}</h3>
                        <span className="text-xs text-[#5c655d]">{selectedScene.duration} · Scene {selectedScene.id}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button onClick={() => setSelectedScene(null)} className="text-[#5c655d] hover:text-[#e8e6df] text-2xl leading-none">×</button>
            </div>
            <p className="text-[#8a9489] leading-relaxed mb-6">{selectedScene.description}</p>
            <div className="rounded-xl bg-[#0a0d0b]/80 border border-[#222719] px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-400 font-semibold">{`>`}</span>
                <span className="text-[#e8e6df] font-semibold">{selectedScene.caption.replace('> ', '')}</span>
              </div>
              <span className="text-xs text-[#5c655d]">Caption cue</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#222719] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm text-[#5c655d]">RSA Motion Canvas Explainer · Thinh YouTube House Style</span>
          <div className="flex items-center gap-3">
            <Github className="w-4 h-4 text-[#5c655d]" />
            <Youtube className="w-4 h-4 text-[#5c655d]" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
