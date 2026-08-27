import {makeScene2D, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {C, FONT, TechPanel, bg, bytePacket, exitLeft, label, rail, register, scanlines} from '../components';

export default makeScene2D(function* (view) {
  view.add(<Node>{bg()}</Node>);

  const terminal = createRef<TechPanel>();
  const db = createRef<TechPanel>();
  const flow = createRef<Node>();
  view.add(<TechPanel ref={terminal} title="auth.log" icon="\uf120" x={-470} y={-40} w={780} h={430} opacity={0} scale={0.8} />);
  view.add(<TechPanel ref={db} title="users.sqlite" icon="\uf1c0" x={470} y={-40} w={780} h={430} opacity={0} scale={0.8} />);
  db().line('user    salt        password_hash', C.yellow, 25);
  db().line('alice   7f3a9c...   $argon2id$...', C.cyan, 23);
  db().line('root    b8120e...   19b25856e1...', C.red, 23);
  yield* all(terminal().opacity(1, 0.7), db().opacity(1, 0.7), terminal().scale(1, 0.7), db().scale(1, 0.7));
  yield* terminal().typeLine('$ login alice', C.cyan);
  yield* terminal().typeLine('password: correct-horse-battery-staple', C.yellow);
  view.add(<Node ref={flow}>{rail(-120, -40, 120, -40, C.lime)}{bytePacket('KDF', C.yellow, {y: -40})}</Node>);
  yield* all(flow().scale(1.2, 0.8), db().position.x(420, 0.8), terminal().position.x(-520, 0.8));
  yield* terminal().typeLine('auth: verifier matched', C.lime);

  const compare = createRef<Node>();
  view.add(<Node ref={compare} opacity={0}>{label('PLAINTEXT  \uf00d', C.red, 52, {x: -430, y: 240})}{label('VERIFIER  \uf00c', C.yellow, 52, {x: 430, y: 240})}<Txt text="password + unique salt + password KDF → verifier" fill={C.cyan} fontFamily={FONT} fontSize={34} y={350} /></Node>);
  yield* all(compare().opacity(1, 0.6), compare().scale(1.05, 0.6));
  yield* waitFor(0.8);
  yield* all(compare().position.x(-2100, 0.8), terminal().position.x(-2300, 0.8), db().position.x(-1700, 0.8), flow().position.x(-2100, 0.8));

  const speed = createRef<Node>();
  view.add(<Node ref={speed} opacity={0}>{label('TOO FAST FOR PASSWORD STORAGE', C.red, 64, {y: -170})}{label('ARGON2ID / SCRYPT / BCRYPT / PBKDF2', C.yellow, 44, {y: -80})}{Array.from({length: 18}, (_, i) => <Txt text={`${(i * 7319).toString(16).padStart(8, '0')} SHA256/s`} fill={i % 3 ? C.cyan : C.orange} fontFamily={FONT} fontSize={24} x={(i % 3 - 1) * 470} y={60 + Math.floor(i / 3) * 42} />)}</Node>);
  yield* all(speed().opacity(1, 0.5), speed().position.y(-20, 0.5));
  yield* all(speed().position.x(25, 0.08), speed().position.x(-25, 0.08), speed().position.x(0, 0.08));
  yield* exitLeft([speed()], 0.7);

  const integrity = createRef<Node>();
  view.add(<Node ref={integrity} opacity={0}><TechPanel title="release page" icon="\uf15b" x={-455} w={690} h={330} /><TechPanel title="terminal" icon="\uf120" x={455} w={690} h={330} /><Txt text="$ sha256sum debian-image.iso" fill={C.cyan} fontFamily={FONT} fontSize={30} x={285} y={-70} /><Txt text="2cf24dba5fb0a30e26e83b2ac5b9e29e" fill={C.yellow} fontFamily={FONT} fontSize={25} x={395} y={10} /><Line points={[[-720, 120], [720, 120]]} stroke={C.lime} lineWidth={5} /></Node>);
  yield* all(integrity().opacity(1, 0.6), integrity().scale(1.03, 0.8));
  yield* all(integrity().children()[4].position.y(-150, 1.2), (integrity().children()[4] as Line).stroke(C.yellow, 0.5));
  yield* exitLeft([integrity()], 0.7);

  const sig = createRef<Node>();
  view.add(<Node ref={sig} opacity={0}>{bytePacket('\uf15b pkg', C.cyan, {x: -620})}{bytePacket('SHA', C.lime, {x: -330})}{bytePacket('\uf084 sig', C.orange, {x: 0})}{bytePacket('\uf3ed verify', C.yellow, {x: 360})}{rail(-560, 0, 300, 0, C.lime)}{label('AUTHENTIC + UNMODIFIED', C.yellow, 54, {y: 190})}</Node>);
  yield* all(sig().opacity(1, 0.7), sig().rotation(2, 0.8), sig().scale(1.08, 0.8));
  yield* exitLeft([sig()], 0.8);

  const systems = createRef<Node>();
  view.add(<Node ref={systems} opacity={0}>{label('HASH TABLE → SPEED', C.orange, 52, {x: -440, y: -120})}{label('CRYPTOGRAPHIC HASH → SECURITY', C.lime, 52, {x: 360, y: -120})}{label('DIFFERENT GOALS', C.yellow, 70, {y: 100})}{Array.from({length: 12}, (_, i) => register(`bucket${i}`, i === 6 ? 'collision' : `key${i}`, i === 6 ? C.red : C.cyan, {x: -770 + i * 140, y: 310, scale: 0.55}))}</Node>);
  yield* all(systems().opacity(1, 0.7), systems().position.x(-60, 1.6, easeInOutCubic));
  yield* waitFor(0.8);
});
