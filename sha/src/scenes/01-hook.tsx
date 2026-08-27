import {makeScene2D, Node, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {C, FONT, TechPanel, bg, bytePacket, exitLeft, label, rail, scanlines} from '../components';

export default makeScene2D(function* (view) {
  const lock = createRef<Txt>();
  const login = createRef<TechPanel>();
  const bullets = createRef<Node>();
  const tunnel = createRef<Node>();
  const digest = createRef<Txt>();
  const orbit = createRef<Node>();
  const hash = createRef<Txt>();
  const bytes = ['68', '75', '6E', '74', '65', '72', '32'];
  const digestText = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

  view.add(<Node>{bg()}<Txt ref={lock} text="\uf023" fill={C.cyan} fontFamily={FONT} fontSize={10} /></Node>);
  yield* all(lock().fontSize(420, 1.8, easeInOutCubic), lock().rotation(12, 1.8), lock().opacity(0, 1.8));

  view.add(<TechPanel ref={login} title="SECURE LOGIN" icon="\uf023" w={920} h={560} opacity={0} scale={0.75} />);
  login().line('USER        hacker', C.lime, 32);
  login().line('PASSWORD    ', C.lime, 32);
  login().line('ENTER       [ READY ]', C.cyan, 30);
  login().line('CLOCK       12:00:00 UTC', C.orange, 25);
  yield* all(login().opacity(1, 0.8), login().scale(1, 0.8), login().position.y(-20, 0.8));
  yield* login().typeLine('> hunter2', C.yellow, 34);
  yield* waitFor(0.2);
  yield* login().typeLine('> •••••••', C.lime, 40);

  const byteRefs = bytes.map(() => createRef<Rect>());
  view.add(<Node ref={bullets} opacity={0}>{bytes.map((b, i) => <Rect ref={byteRefs[i]} width={82} height={82} x={(i - 3) * 110} fill={C.bg} stroke={C.lime} lineWidth={3}><Txt text="•" fill={C.lime} fontFamily={FONT} fontSize={58} /></Rect>)}</Node>);
  yield* all(login().scale(2.8, 1.2), login().opacity(0, 1), bullets().opacity(1, 0.5), bullets().scale(1.3, 1.2));
  yield* sequence(0.05, ...byteRefs.map((r, i) => all((r().children()[0] as Txt).text(bytes[i], 0.35), r().stroke(C.cyan, 0.35))));

  view.add(<Node ref={tunnel} opacity={0}>{rail(-760, 0, 760, 0, C.cyan)}<Rect width={1260} height={210} stroke={C.cyan} lineWidth={3} fill={C.bg} /><Txt text="\uf013 PROCESSING TUNNEL" fill={C.cyan} fontFamily={FONT} fontSize={36} y={-150} /></Node>);
  yield* all(tunnel().opacity(1, 0.6), bullets().scale(0.18, 1.1), bullets().position.x(720, 1.1), tunnel().scale(1.08, 1.1));
  view.add(<Txt ref={digest} text={digestText} fill={C.cyan} fontFamily={FONT} fontSize={28} y={190} opacity={0} />);
  yield* all(tunnel().position.x(-2100, 0.9), bullets().opacity(0, 0.4), digest().opacity(1, 0.8), digest().position.y(0, 0.8));

  view.add(<Node ref={orbit} opacity={0}>{['\uf023 LOGIN','\uf15b DOWNLOAD','\uf1eb PCAP','\uf120 CODE','\uf1c0 DATABASE'].map((t, i) => <TechPanel title={t} w={300} h={150} x={Math.cos(i * 1.256) * 520} y={Math.sin(i * 1.256) * 270} scale={0.8} />)}{label('HASH FUNCTIONS', C.lime, 76, {y: -420})}{label('SHA-2', C.yellow, 58, {y: -330})}</Node>);
  yield* all(digest().rotation(90, 1), orbit().opacity(1, 0.8), orbit().rotation(360, 4), digest().scale(0.82, 1));
  yield* exitLeft([orbit(), digest()], 0.8);

  view.add(<Txt ref={hash} text="" fill={C.lime} fontFamily={FONT} fontSize={145} opacity={0} />);
  yield* hash().opacity(1, 0.4);
  for (const ch of ['H', 'A', 'S', 'H']) {
    hash().text(hash().text() + ch);
    yield* all(hash().scale(1.08, 0.12), hash().scale(1, 0.12));
  }
  yield* waitFor(0.8);
});
