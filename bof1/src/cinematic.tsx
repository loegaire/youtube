import {Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, makeRef, sequence, waitFor} from '@motion-canvas/core';
import {Backdrop, CodeLine, Panel} from './visuals';
import {C, FONT, MONO} from './theme';
import {AccentName, STORY_BY_ID, StoryScene} from './storyboard';

const accentColor = (name: AccentName) => ({
  green: C.green,
  mint: C.blue,
  amber: C.orange,
  coral: C.red,
  neutral: C.violet,
})[name];

function cameraMove(stage: Node, mode: StoryScene['camera'], duration = 1.2) {
  const target = {
    wide: {x: 0, y: 0, scale: 1, rotation: 0},
    push: {x: 0, y: 8, scale: 1.015, rotation: 0},
    'pan-left': {x: 50, y: 4, scale: 0.96, rotation: -0.28},
    'pan-right': {x: -50, y: 4, scale: 0.96, rotation: 0.28},
    tilt: {x: 0, y: -4, scale: 0.98, rotation: -0.45},
  }[mode ?? 'wide'];
  return all(
    stage.position.x(target.x, duration),
    stage.position.y(target.y, duration),
    stage.scale(target.scale, duration),
    stage.rotation(target.rotation, duration),
  );
}

function Caption({text, detail, color, ref}: {text: string; detail: string; color: string; ref: any}) {
  return (
    <Rect ref={ref} y={455} width={1760} height={116} radius={4} fill={C.panel2} stroke={C.faint} lineWidth={1} opacity={0}>
      <Rect x={-876} width={8} height={116} fill={color} />
      <Txt text={text} x={-820} y={detail ? -17 : 0} offsetX={-1} fill={color} fontFamily={FONT} fontSize={30} fontWeight={700} letterSpacing={-0.45} />
      {detail ? <Txt text={detail} x={-820} y={25} offsetX={-1} fill={C.muted} fontFamily={FONT} fontSize={18} /> : null}
    </Rect>
  );
}

function GlassLabel({text, x, y, color = C.text, width = 220}: {text: string; x: number; y: number; color?: string; width?: number}) {
  return (
    <Rect x={x} y={y} width={width} height={72} radius={4} fill={C.panel2} stroke={C.faint} lineWidth={1}>
      <Txt text={text} fill={color} fontFamily={MONO} fontSize={22} fontWeight={700} />
    </Rect>
  );
}

export function createCinematicScene(id: string) {
  const cfg = STORY_BY_ID.get(id);
  if (!cfg) throw new Error(`Unknown storyboard scene: ${id}`);

  return makeScene2D(function* (view) {
    const color = accentColor(cfg.accent);
    const stage = createRef<Node>();
    const caption = createRef<Rect>();
    let elapsed = 0;

    view.add(
      <>
        <Backdrop chapter={cfg.chapter} title={cfg.title} />
        <Node ref={stage} y={12} />
        <Caption ref={caption} text={cfg.headline} detail={cfg.detail} color={color} />
      </>,
    );

    const animate = function* () {

    if (cfg.kind === 'terminal') {
      const terminal = createRef<Rect>();
      const prompt = createRef<Txt>();
      const cursor = createRef<Rect>();
      const chars: Txt[] = [];
      const nodes: Rect[] = [];
      const routes: Line[] = [];
      const address = createRef<Rect>();
      const input = cfg.variation === 'prompt' ? 'hello' : 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

      stage().add(
        <>
          <Panel ref={terminal} x={cfg.variation === 'redirect' ? -430 : -160} y={10} width={900} height={430}>
            <Rect y={-185} width={898} height={60} radius={[8, 8, 0, 0]} fill={C.glassStrong}>
              {[-390, -362, -334].map(x => <Rect x={x} width={10} height={10} radius={2} fill={C.muted} />)}
              <Txt text="./chal" fill={C.muted} fontFamily={MONO} fontSize={19} />
            </Rect>
            <Txt ref={prompt} text="Please enter your string:" x={-390} y={-88} offsetX={-1} fill={C.text} fontFamily={MONO} fontSize={27} opacity={0} />
            {input.split('').map((char, i) => (
              <Txt ref={makeRef(chars, i)} text={char} x={-390 + i * 17.2} y={-18} offsetX={-1} fill={cfg.variation === 'prompt' ? C.green : C.red} fontFamily={MONO} fontSize={24} fontWeight={700} opacity={0} scale={0.45} />
            ))}
            <Rect ref={cursor} x={-385} y={56} width={12} height={34} fill={C.green} opacity={0} />
          </Panel>
          {cfg.variation === 'redirect' ? (
            <>
              {['main', 'vuln', 'win'].map((label, i) => (
                <Rect ref={makeRef(nodes, i)} x={430 + (i === 2 ? 260 : 0)} y={-100 + i * 145} width={230} height={90} radius={5} fill={C.panel2} stroke={i === 2 ? C.orange : C.faint} lineWidth={1} opacity={0}>
                  <Txt text={label} fill={i === 2 ? C.orange : C.text} fontFamily={MONO} fontSize={27} fontWeight={700} />
                </Rect>
              ))}
              <Line ref={makeRef(routes, 0)} points={[[430, -52], [430, -2]]} stroke={C.blue} lineWidth={4} endArrow arrowSize={14} end={0} />
              <Line ref={makeRef(routes, 1)} points={[[545, 190], [665, 190]]} stroke={C.red} lineWidth={4} endArrow arrowSize={14} end={0} />
              <Rect ref={address} x={520} y={45} width={300} height={56} radius={3} fill={'#D8BE731A'} stroke={C.orange} lineWidth={1} opacity={0}>
                <Txt text="saved return address" fill={C.orange} fontFamily={MONO} fontSize={17} />
              </Rect>
            </>
          ) : null}
        </>,
      );

      terminal().opacity(0);
      terminal().position.y(70);
      yield* all(terminal().opacity(1, 0.7), terminal().position.y(10, 0.7)); elapsed += 0.7;
      yield* prompt().opacity(1, 0.45); elapsed += 0.45;
      yield* sequence(cfg.variation === 'prompt' ? 0.16 : 0.035, ...chars.map(char => all(char.opacity(1, 0.22), char.scale(1, 0.22)))); elapsed += cfg.variation === 'prompt' ? 0.9 : 1.75;
      yield* cursor().opacity(1, 0.3); elapsed += 0.3;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      if (cfg.variation === 'prompt') {
        yield* all(cursor().position.x(-300, 1.1), terminal().stroke(C.green, 1.1)); elapsed += 1.1;
      } else if (cfg.variation === 'long-input') {
        yield* all(terminal().stroke(C.red, 0.7), terminal().scale(1.035, 0.7)); elapsed += 0.7;
        yield* terminal().scale(1, 0.45); elapsed += 0.45;
      } else {
        yield* sequence(0.2, ...nodes.map(node => node.opacity(1, 0.5))); elapsed += 0.9;
        yield* routes[0].end(1, 0.7); elapsed += 0.7;
        yield* address().opacity(1, 0.5); elapsed += 0.5;
        yield* routes[1].end(1, 1); elapsed += 1;
      }
    }

    if (cfg.kind === 'machine') {
      const cells: Rect[] = [];
      const head = createRef<Rect>();
      const state = createRef<Txt>();
      const rules: Rect[] = [];
      const values = ['0', '1', '1', '0', '0', '1', '0'];
      stage().add(
        <>
          {values.map((value, i) => (
            <Rect ref={makeRef(cells, i)} x={-540 + i * 180} y={20} width={142} height={142} radius={4} fill={C.panel2} stroke={C.faint} lineWidth={1} opacity={0} scale={0.4}>
              <Txt text={value} fill={C.text} fontFamily={MONO} fontSize={54} fontWeight={700} />
              <Txt text={String(i)} y={96} fill={C.muted} fontFamily={MONO} fontSize={16} />
            </Rect>
          ))}
          <Rect ref={head} x={-180} y={-160} width={132} height={56} radius={3} fill={C.blue} opacity={0}>
            <Txt text="READ" fill={C.bg} fontFamily={MONO} fontSize={17} fontWeight={800} letterSpacing={1.6} />
            <Line points={[[0, 28], [0, 72]]} stroke={C.blue} lineWidth={5} endArrow arrowSize={14} />
          </Rect>
          <Rect x={650} y={-180} width={270} height={112} radius={4} fill={C.panel} stroke={C.orange} lineWidth={1}>
            <Txt text="CURRENT STATE" y={-24} fill={C.muted} fontFamily={MONO} fontSize={16} letterSpacing={1.2} />
            <Txt ref={state} text="A" y={20} fill={C.orange} fontFamily={MONO} fontSize={38} fontWeight={800} />
          </Rect>
          {(cfg.values ?? ['READ 0', 'WRITE 1', 'MOVE RIGHT']).map((rule, i) => (
            <Rect ref={makeRef(rules, i)} x={-330 + i * 330} y={250} width={290} height={76} radius={4} fill={C.panel2} stroke={i === 0 ? color : C.faint} lineWidth={1} opacity={0}>
              <Txt text={rule} fill={i === 0 ? color : C.text} fontFamily={MONO} fontSize={18} fontWeight={700} />
            </Rect>
          ))}
        </>,
      );
      yield* sequence(0.1, ...cells.map(cell => all(cell.opacity(1, 0.35), cell.scale(1, 0.35)))); elapsed += 1;
      yield* head().opacity(1, 0.5); elapsed += 0.5;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      yield* all(cells[2].fill(C.blue, 0.65), cells[2].scale(1.08, 0.65)); elapsed += 0.65;
      yield* sequence(0.22, ...rules.map(rule => rule.opacity(1, 0.5))); elapsed += 0.95;
      if (cfg.variation !== 'birth') {
        cells[2].removeChildren();
        cells[2].add(<Txt text={cfg.variation === 'update' || cfg.variation === 'repeat' ? '1' : '0'} fill={C.bg} fontFamily={MONO} fontSize={54} fontWeight={800} />);
        yield* all(head().position.x(0, 1), cells[2].scale(1, 0.5), cells[3].stroke(C.blue, 1)); elapsed += 1;
        yield* state().text('B', 0.65); elapsed += 0.65;
      }
      if (cfg.variation === 'repeat') {
        yield* all(head().position.x(180, 0.8), cells[4].stroke(C.blue, 0.8)); elapsed += 0.8;
        yield* all(head().position.x(360, 0.8), cells[5].stroke(C.blue, 0.8)); elapsed += 0.8;
      }
    }

    if (cfg.kind === 'memory') {
      const rows: Rect[] = [];
      const cpu = createRef<Rect>();
      const bus = createRef<Line>();
      const pointer = createRef<Line>();
      const ip = createRef<Txt>();
      const register = createRef<Txt>();
      const addresses = ['0x1000', '0x1001', '0x1002', '0x1003', '0x1004', '0x1005'];
      stage().add(
        <>
          <Panel x={-460} y={15} width={760} height={570}>
            <Txt text="ADDRESSABLE MEMORY" x={-300} y={-245} fill={C.muted} fontFamily={MONO} fontSize={18} fontWeight={700} />
            {addresses.map((addr, i) => (
              <Rect ref={makeRef(rows, i)} x={-20} y={-175 + i * 72} width={620} height={58} radius={3} fill={i === 2 ? C.glassStrong : C.bg2} stroke={i === 2 ? C.orange : C.faint} lineWidth={1} opacity={0}>
                <Txt text={addr} x={-245} fill={C.orange} fontFamily={MONO} fontSize={18} />
                <Txt text={['…  …  …', 'MOV r0, [x]', 'ADD r0, 1', 'MOV [x], r0', 'CMP r0, 5', 'JMP 0x1001'][i]} x={40} fill={i === 2 ? C.blue : C.text} fontFamily={MONO} fontSize={20} />
              </Rect>
            ))}
          </Panel>
          <Panel ref={cpu} x={520} y={15} width={550} height={570} stroke={C.blue}>
            <Txt text="CPU" x={-205} y={-240} fill={C.blue} fontFamily={MONO} fontSize={22} fontWeight={800} />
            <GlassLabel text="INSTRUCTION POINTER" x={-92} y={-120} width={236} color={C.muted} />
            <Rect x={128} y={-120} width={170} height={72} radius={4} fill={C.bg2} stroke={C.faint} lineWidth={1}>
              <Txt ref={ip} text="0x1002" fill={C.orange} fontFamily={MONO} fontSize={22} fontWeight={800} />
            </Rect>
            <GlassLabel text="REGISTER r0" x={-92} y={20} width={236} color={C.muted} />
            <Rect x={128} y={20} width={170} height={72} radius={4} fill={C.bg2} stroke={C.faint} lineWidth={1}>
              <Txt ref={register} text="4" fill={C.green} fontFamily={MONO} fontSize={26} fontWeight={800} />
            </Rect>
            <GlassLabel text="ARITHMETIC / LOGIC" x={0} y={160} width={420} color={C.text} />
          </Panel>
          <Line ref={bus} points={[[-70, 15], [235, 15]]} stroke={C.blue} lineWidth={4} startArrow endArrow arrowSize={14} end={0} />
          <Line ref={pointer} points={[[-780, -31], [-845, -31]]} stroke={C.orange} lineWidth={4} endArrow arrowSize={14} end={0} />
        </>,
      );
      cpu().opacity(0);
      yield* sequence(0.1, ...rows.map(row => row.opacity(1, 0.35))); elapsed += 0.95;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      yield* cpu().opacity(1, 0.65); elapsed += 0.65;
      yield* bus().end(1, 0.8); elapsed += 0.8;
      yield* pointer().end(1, 0.55); elapsed += 0.55;
      if (cfg.variation === 'fetch-loop') {
        yield* pointer().position.y(72, 0.7); elapsed += 0.7;
        yield* ip().text('0x1003', 0.65); elapsed += 0.65;
        yield* register().text('5', 0.65); elapsed += 0.65;
        yield* pointer().position.y(144, 0.7); elapsed += 0.7;
        yield* ip().text('0x1004', 0.65); elapsed += 0.65;
      } else if (cfg.variation === 'ip') {
        yield* all(ip().scale(1.3, 0.5), rows[2].stroke(C.orange, 0.5)); elapsed += 0.5;
        yield* ip().scale(1, 0.45); elapsed += 0.45;
      } else {
        yield* register().text('4 → 5', 0.8); elapsed += 0.8;
      }
    }

    if (cfg.kind === 'program') {
      const panels: Rect[] = [];
      const arrows: Line[] = [];
      const codeRows: Txt[] = [];
      const byteTiles: Rect[] = [];
      const register = createRef<Txt>();
      const memory = createRef<Txt>();
      const assembly = cfg.code ?? ['mov eax, [x]', 'add eax, 1', 'mov [x], eax'];
      const bytes = cfg.values ?? ['A1', '00', '10', '40', '83', 'C0', '01'];
      stage().add(
        <>
          {[
            {x: -620, label: 'SOURCE', stroke: C.green},
            {x: 0, label: 'INSTRUCTIONS', stroke: C.blue},
            {x: 620, label: 'MACHINE BYTES', stroke: C.orange},
          ].map((item, i) => (
            <Panel ref={makeRef(panels, i)} x={item.x} y={0} width={500} height={480} stroke={item.stroke}>
              <Txt text={item.label} x={-190} y={-205} fill={item.stroke} fontFamily={MONO} fontSize={17} fontWeight={800} letterSpacing={1.2} />
              {i === 0 ? <Txt text="x = x + 1;" fill={C.text} fontFamily={MONO} fontSize={38} fontWeight={700} /> : null}
              {i === 1 ? assembly.slice(0, 4).map((line, j) => <Txt ref={makeRef(codeRows, j)} text={line} x={-190} y={-100 + j * 72} offsetX={-1} fill={j === 1 ? C.blue : C.text} fontFamily={MONO} fontSize={23} opacity={0} />) : null}
              {i === 2 ? bytes.slice(0, 8).map((byte, j) => (
                <Rect ref={makeRef(byteTiles, j)} x={-150 + (j % 4) * 100} y={-75 + Math.floor(j / 4) * 100} width={76} height={68} radius={3} fill={C.panel2} stroke={C.orange} lineWidth={1} opacity={0} scale={0.5}>
                  <Txt text={byte} fill={C.orange} fontFamily={MONO} fontSize={20} fontWeight={700} />
                </Rect>
              )) : null}
            </Panel>
          ))}
          <Line ref={makeRef(arrows, 0)} points={[[-360, 0], [-280, 0]]} stroke={C.blue} lineWidth={4} endArrow arrowSize={14} end={0} />
          <Line ref={makeRef(arrows, 1)} points={[[280, 0], [360, 0]]} stroke={C.blue} lineWidth={4} endArrow arrowSize={14} end={0} />
          <Rect x={0} y={300} width={820} height={84} radius={4} fill={C.panel2} stroke={C.faint} lineWidth={1}>
            <Txt text="REGISTER" x={-330} fill={C.muted} fontFamily={MONO} fontSize={16} />
            <Txt ref={register} text="4" x={-180} fill={C.green} fontFamily={MONO} fontSize={25} fontWeight={800} />
            <Txt text="MEMORY[x]" x={60} fill={C.muted} fontFamily={MONO} fontSize={16} />
            <Txt ref={memory} text="4" x={240} fill={C.green} fontFamily={MONO} fontSize={25} fontWeight={800} />
          </Rect>
        </>,
      );
      panels.forEach(panel => {panel.opacity(0); panel.position.y(50);});
      yield* sequence(0.22, ...panels.map(panel => all(panel.opacity(1, 0.55), panel.position.y(0, 0.55)))); elapsed += 1;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      yield* arrows[0].end(1, 0.6); elapsed += 0.6;
      yield* sequence(0.16, ...codeRows.map(row => row.opacity(1, 0.45))); elapsed += 0.95;
      yield* arrows[1].end(1, 0.6); elapsed += 0.6;
      yield* sequence(0.08, ...byteTiles.map(tile => all(tile.opacity(1, 0.3), tile.scale(1, 0.3)))); elapsed += 0.9;
      if (cfg.variation === 'execute') {
        yield* register().text('4 → 5', 0.75); elapsed += 0.75;
        yield* memory().text('4 → 5', 0.75); elapsed += 0.75;
      }
    }

    if (cfg.kind === 'stack') {
      const regions: Rect[] = [];
      const frames: Rect[] = [];
      const heap = createRef<Rect>();
      const returnTile = createRef<Rect>();
      const callArrow = createRef<Line>();
      const ip = createRef<Rect>();
      const regionData = [
        ['STACK', C.orange, 130],
        ['MAPPED / UNUSED', C.muted, 105],
        ['HEAP', C.green, 105],
        ['GLOBAL DATA', C.violet, 105],
        ['PROGRAM INSTRUCTIONS', C.blue, 62],
      ] as const;
      stage().add(
        <>
          <Panel x={-500} y={15} width={640} height={650}>
            <Txt text="HIGHER ADDRESSES" x={-240} y={-290} fill={C.muted} fontFamily={MONO} fontSize={16} />
            {regionData.map(([label, stroke, height], i) => (
              <Rect ref={label === 'HEAP' ? heap : makeRef(regions, regions.length)} y={-205 + i * 120} width={520} height={height} radius={4} fill={C.panel2} stroke={stroke} lineWidth={1} opacity={0} scale={[1, 0.2]}>
                <Txt text={label} fill={stroke} fontFamily={MONO} fontSize={label.length > 12 ? 18 : 25} fontWeight={800} />
              </Rect>
            ))}
          </Panel>
          <Panel x={430} y={15} width={760} height={650} stroke={C.orange}>
            <Txt text="ZOOM: STACK" x={-290} y={-285} fill={C.orange} fontFamily={MONO} fontSize={18} fontWeight={800} />
            {['main frame', 'saved bookkeeping', 'vuln frame'].map((label, i) => (
              <Rect ref={makeRef(frames, i)} y={175 - i * 160} width={570} height={118 + (i === 2 ? 40 : 0)} radius={4} fill={C.panel2} stroke={i === 1 ? C.orange : C.faint} lineWidth={i === 1 ? 2 : 1} opacity={0}>
                <Txt text={label} x={-200} offsetX={-1} fill={i === 1 ? C.orange : C.text} fontFamily={MONO} fontSize={21} fontWeight={i === 1 ? 700 : 500} />
              </Rect>
            ))}
            <Rect ref={returnTile} y={15} width={570} height={82} radius={4} fill={'#D8BE731C'} stroke={C.orange} lineWidth={2} opacity={0}>
              <Txt text="return address  0x0804932f" fill={C.orange} fontFamily={MONO} fontSize={21} fontWeight={700} />
            </Rect>
            <Line ref={callArrow} points={[[250, 245], [250, -240]]} stroke={C.blue} lineWidth={4} endArrow arrowSize={14} end={0} />
          </Panel>
          <Rect ref={ip} x={770} y={-275} width={260} height={70} radius={4} fill={C.panel2} stroke={C.orange} lineWidth={1} opacity={0}>
            <Txt text="INSTRUCTION POINTER" fill={C.orange} fontFamily={MONO} fontSize={16} fontWeight={700} />
          </Rect>
        </>,
      );
      const visibleRegions = [...regions, heap()];
      yield* sequence(0.12, ...visibleRegions.map(region => all(region.opacity(1, 0.4), region.scale.y(1, 0.4)))); elapsed += 1.1;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      if (cfg.variation === 'heap') {
        yield* all(heap().scale.x(1.12, 0.8), heap().fill('#8CCB9A22', 0.8)); elapsed += 0.8;
        yield* all(heap().opacity(0.2, 0.8), stage().position.x(120, 0.8), stage().scale(1.13, 0.8)); elapsed += 0.8;
      } else {
        yield* frames[0].opacity(1, 0.55); elapsed += 0.55;
        yield* callArrow().end(0.42, 0.7); elapsed += 0.7;
        yield* returnTile().opacity(1, 0.55); elapsed += 0.55;
        yield* all(callArrow().end(1, 0.8), frames[2].opacity(1, 0.8)); elapsed += 0.8;
        if (cfg.variation === 'ret') {
          yield* ip().opacity(1, 0.45); elapsed += 0.45;
          yield* all(returnTile().position([340, -290], 1.1), returnTile().scale(0.58, 1.1)); elapsed += 1.1;
        }
      }
    }

    if (cfg.kind === 'code') {
      const lines: Txt[] = [];
      const highlight = createRef<Rect>();
      const win = createRef<Rect>();
      const bridge = createRef<Line>();
      const code = cfg.code ?? ['char buf[32];', 'gets(buf);', 'get_return_address();'];
      stage().add(
        <>
          <Panel x={cfg.variation === 'win' ? -400 : -160} y={0} width={cfg.variation === 'win' ? 920 : 1040} height={600} stroke={cfg.variation === 'vuln' ? C.red : C.faint}>
            <Txt text={cfg.variation === 'main' ? 'main()' : 'vuln()'} x={-450} y={-255} fill={color} fontFamily={MONO} fontSize={20} fontWeight={800} />
            <Rect ref={highlight} x={-10} y={-155} width={920} height={54} radius={3} fill={`${color}20`} opacity={0} />
            {code.map((line, i) => (
              <Txt ref={makeRef(lines, i)} text={line} x={-440} y={-155 + i * 78} offsetX={-1} fill={line.includes('gets') ? C.red : line.includes('buf[32]') ? C.green : C.text} fontFamily={MONO} fontSize={line.length > 40 ? 20 : 24} opacity={0} />
            ))}
          </Panel>
          {cfg.variation === 'win' ? (
            <>
              <Panel ref={win} x={650} y={70} width={480} height={430} stroke={C.orange}>
                <Txt text="win()" x={-180} y={-175} fill={C.orange} fontFamily={MONO} fontSize={21} fontWeight={800} />
                <CodeLine text={'fopen("flag.txt", "r")'} x={-190} y={-70} size={20} />
                <CodeLine text={'fgets(buf, 64, f)'} x={-190} y={10} size={20} color={C.green} />
                <CodeLine text={'printf(buf)'} x={-190} y={90} size={21} color={C.green} />
                <Txt text="UNREACHABLE" y={165} fill={C.muted} fontFamily={MONO} fontSize={15} letterSpacing={1.5} />
              </Panel>
              <Line ref={bridge} points={[[50, 70], [405, 70]]} stroke={C.faint} lineWidth={3} lineDash={[12, 12]} end={0} />
            </>
          ) : null}
        </>,
      );
      lines.forEach(line => line.position.x(-420));
      yield* sequence(0.18, ...lines.map(line => all(line.opacity(1, 0.45), line.position.x(-440, 0.45)))); elapsed += 1.2;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      yield* highlight().opacity(1, 0.45); elapsed += 0.45;
      const focusIndex = cfg.variation === 'main' ? Math.min(2, lines.length - 1) : cfg.variation === 'vuln' ? Math.min(2, lines.length - 1) : 0;
      yield* highlight().position.y(-155 + focusIndex * 78, 0.8); elapsed += 0.8;
      yield* all(lines[focusIndex].scale(1.05, 0.45), lines[focusIndex].fill(color, 0.45)); elapsed += 0.45;
      if (cfg.variation === 'win') {
        win().opacity(0);
        yield* win().opacity(1, 0.7); elapsed += 0.7;
        yield* bridge().end(0.78, 0.8); elapsed += 0.8;
        yield* bridge().stroke(C.red, 0.45); elapsed += 0.45;
      }
    }

    if (cfg.kind === 'overflow') {
      const bytes: Rect[] = [];
      const barrier = createRef<Rect>();
      const returnTile = createRef<Rect>();
      const counter = createRef<Txt>();
      const signature = createRef<Rect>();
      const count = cfg.variation === 'signature' ? 0 : cfg.variation === 'bounded' ? 32 : 44;
      stage().add(
        <>
          {cfg.variation === 'signature' ? (
            <Rect ref={signature} y={-30} width={1160} height={260} radius={5} fill={C.panel2} stroke={C.red} lineWidth={1}>
              <Txt text="gets(" x={-430} fill={C.text} fontFamily={MONO} fontSize={54} fontWeight={700} />
              <Rect x={-145} width={310} height={100} radius={4} fill={'#8CCB9A20'} stroke={C.green} lineWidth={1}>
                <Txt text="buf" fill={C.green} fontFamily={MONO} fontSize={42} fontWeight={800} />
              </Rect>
              <Txt text=");" x={65} fill={C.text} fontFamily={MONO} fontSize={54} fontWeight={700} />
              <Rect x={380} width={300} height={100} radius={4} fill={'#F0786E13'} stroke={C.red} lineWidth={1} lineDash={[10, 10]}>
                <Txt text="capacity ?" fill={C.red} fontFamily={MONO} fontSize={26} />
              </Rect>
            </Rect>
          ) : null}
          {cfg.variation !== 'signature' ? <Panel y={0} width={1700} height={520} stroke={cfg.variation === 'bounded' ? C.green : C.red}>
            <Txt text="vuln stack frame" x={-735} y={-225} fill={C.muted} fontFamily={MONO} fontSize={17} />
            <Txt text="32-BYTE BUFFER" x={-700} y={-185} offsetX={-1} fill={C.green} fontFamily={MONO} fontSize={17} fontWeight={800} letterSpacing={1.2} />
            {count > 32 ? <Txt text="ADJACENT STACK DATA" x={-700} y={62} offsetX={-1} fill={C.red} fontFamily={MONO} fontSize={17} fontWeight={800} letterSpacing={1.2} /> : null}
            {Array.from({length: count}).map((_, i) => (
              <Rect
                ref={makeRef(bytes, i)}
                x={i < 32 ? -700 + (i % 16) * 90 : -700 + (i - 32) * 90}
                y={i < 32 ? -112 + Math.floor(i / 16) * 76 : 130}
                width={72}
                height={58}
                radius={3}
                fill={C.bg2}
                stroke={i < 32 ? C.green : C.red}
                lineWidth={1}
                opacity={0}
                scale={0.35}
              >
                <Txt text={cfg.variation === 'bounded' ? (i < 5 ? 'HELLO'[i] : '·') : 'A'} fill={i < 32 ? C.green : C.red} fontFamily={MONO} fontSize={18} fontWeight={800} />
              </Rect>
            ))}
            <Rect ref={barrier} x={0} y={36} width={1450} height={6} fill={C.green} opacity={0} />
            <Rect ref={returnTile} x={590} y={220} width={300} height={72} radius={4} fill={'#D8BE731B'} stroke={C.orange} lineWidth={2} opacity={0}>
              <Txt text="RETURN ADDRESS" fill={C.orange} fontFamily={MONO} fontSize={18} fontWeight={800} />
            </Rect>
            <Txt ref={counter} text="0 / 32" y={225} fill={C.green} fontFamily={MONO} fontSize={22} opacity={0} />
          </Panel> : null}
        </>,
      );
      if (cfg.variation === 'signature') {
        signature().scale(0.78); signature().opacity(0);
        yield* all(signature().opacity(1, 0.65), signature().scale(1, 0.65)); elapsed += 0.65;
        yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
        yield* signature().children()[3].opacity(0.25, 0.7); elapsed += 0.7;
        yield* signature().children()[3].opacity(1, 0.5); elapsed += 0.5;
      } else {
        yield* sequence(0.045, ...bytes.map(byte => all(byte.opacity(1, 0.22), byte.scale(1, 0.22)))); elapsed += 2.2;
        yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
        if (cfg.variation === 'bounded') {
          yield* all(barrier().opacity(1, 0.5), counter().opacity(1, 0.5)); elapsed += 0.5;
          yield* counter().text('32 / 32  STOP', 1); elapsed += 1;
        } else {
          yield* returnTile().opacity(1, 0.55); elapsed += 0.55;
          yield* sequence(0.05, ...bytes.slice(32).map(byte => byte.fill(C.red, 0.22))); elapsed += 0.9;
          if (cfg.variation === 'return-tile') {
            yield* all(returnTile().fill(C.red, 0.8), returnTile().stroke(C.red, 0.8), returnTile().scale(1.08, 0.8)); elapsed += 0.8;
            yield* returnTile().scale(1, 0.45); elapsed += 0.45;
          }
        }
      }
    }

    if (cfg.kind === 'analysis') {
      const terminal = createRef<Rect>();
      const lines: Txt[] = [];
      const cyclic: Txt[] = [];
      const crash = createRef<Rect>();
      const offset = createRef<Rect>();
      const connector = createRef<Line>();
      const content = cfg.code ?? ['$ file ./chal', '$ checksec --file=./chal', '$ gdb ./chal'];
      stage().add(
        <>
          <Panel ref={terminal} x={cfg.variation === 'disassembly' ? -470 : -260} y={-15} width={1040} height={600}>
            <Txt text="ANALYSIS" x={-450} y={-255} fill={C.green} fontFamily={MONO} fontSize={18} fontWeight={800} />
            {content.map((line, i) => <Txt ref={makeRef(lines, i)} text={line} x={-440} y={-170 + i * 68} offsetX={-1} fill={line.includes('gets') ? C.red : line.includes('0x') || line.includes('sub') ? C.orange : C.text} fontFamily={MONO} fontSize={line.length > 35 ? 19 : 23} opacity={0} />)}
            {cfg.variation === 'cyclic' ? cfg.headline.replace('…', '').split('').map((char, i) => (
              <Txt ref={makeRef(cyclic, i)} text={char} x={-430 + i * 25} y={160} fill={[C.green, C.blue, C.orange, C.violet][Math.floor(i / 4) % 4]} fontFamily={MONO} fontSize={24} fontWeight={700} opacity={0} scale={0.3} />
            )) : null}
          </Panel>
          <Rect ref={crash} x={380} y={120} width={500} height={120} radius={4} fill={'#F0786E16'} stroke={C.red} lineWidth={2} opacity={0}>
            <Txt text="EIP = 0x6161616c" fill={C.red} fontFamily={MONO} fontSize={27} fontWeight={800} />
          </Rect>
          <Line ref={connector} points={[[630, 120], [675, 120]]} stroke={C.violet} lineWidth={4} endArrow arrowSize={14} end={0} />
          <Rect ref={offset} x={790} y={120} width={220} height={120} radius={4} fill={C.orange} opacity={0}>
            <Txt text="OFFSET" y={-22} fill={C.bg} fontFamily={MONO} fontSize={17} fontWeight={800} />
            <Txt text="44 bytes" y={22} fill={C.bg} fontFamily={MONO} fontSize={31} fontWeight={900} />
          </Rect>
        </>,
      );
      yield* sequence(0.22, ...lines.map(line => line.opacity(1, 0.45))); elapsed += 1.35;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      if (cfg.variation === 'cyclic') {
        yield* sequence(0.055, ...cyclic.map(char => all(char.opacity(1, 0.2), char.scale(1, 0.2)))); elapsed += 1.8;
        yield* all(terminal().position.x(-480, 1), stage().scale(1.12, 1)); elapsed += 1;
      }
      if (cfg.variation === 'offset' || cfg.variation === 'cyclic') {
        yield* crash().opacity(1, 0.55); elapsed += 0.55;
        yield* connector().end(1, 0.55); elapsed += 0.55;
        yield* all(offset().opacity(1, 0.5), offset().scale(1.05, 0.5)); elapsed += 0.5;
      }
    }

    if (cfg.kind === 'payload') {
      const padding: Rect[] = [];
      const addressBytes: Rect[] = [];
      const payload = createRef<Rect>();
      const symbol = createRef<Txt>();
      const arrow = createRef<Line>();
      const code: Txt[] = [];
      const bytes = ['08', '04', '91', 'f6'];
      stage().add(
        <>
          <Panel y={-95} width={1640} height={420} stroke={C.orange}>
            <Txt text="PAYLOAD" x={-720} y={-165} fill={C.muted} fontFamily={MONO} fontSize={18} fontWeight={800} />
            <Rect ref={payload} y={-35} width={1450} height={120} radius={4} fill={C.bg2} stroke={C.faint} lineWidth={1}>
              {Array.from({length: 22}).map((_, i) => (
                <Rect ref={makeRef(padding, i)} x={-660 + i * 52} width={44} height={82} radius={2} fill={'#8CCB9A20'} stroke={C.green} lineWidth={1} opacity={0} scale={[0.2, 1]}>
                  <Txt text="A" fill={C.green} fontFamily={MONO} fontSize={17} fontWeight={800} />
                </Rect>
              ))}
              {bytes.map((byte, i) => (
                <Rect ref={makeRef(addressBytes, i)} x={525 + i * 58} width={50} height={82} radius={2} fill={'#D8BE7322'} stroke={C.orange} lineWidth={1} opacity={0}>
                  <Txt text={byte} fill={C.orange} fontFamily={MONO} fontSize={17} fontWeight={800} />
                </Rect>
              ))}
            </Rect>
            <Txt ref={symbol} text="win = 0x080491f6" y={110} fill={C.orange} fontFamily={MONO} fontSize={29} fontWeight={800} opacity={0} />
          </Panel>
          <Line ref={arrow} points={[[-180, 225], [20, 225]]} stroke={C.blue} lineWidth={4} endArrow arrowSize={14} end={0} />
          <Panel x={500} y={255} width={710} height={250} stroke={C.green}>
            {(cfg.code ?? ['offset = 44', 'payload = b"A" * offset + p32(win)']).map((line, i) => <Txt ref={makeRef(code, i)} text={line} x={-300} y={-60 + i * 62} offsetX={-1} fill={i === 0 ? C.orange : C.green} fontFamily={MONO} fontSize={line.length > 38 ? 18 : 21} opacity={0} />)}
          </Panel>
        </>,
      );
      yield* symbol().opacity(1, 0.6); elapsed += 0.6;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      yield* sequence(0.045, ...padding.map(tile => all(tile.opacity(1, 0.2), tile.scale.x(1, 0.2)))); elapsed += 1.2;
      yield* sequence(0.16, ...addressBytes.map(tile => tile.opacity(1, 0.35))); elapsed += 0.85;
      if (cfg.variation === 'endian') {
        yield* sequence(0.12, ...addressBytes.map((tile, i) => tile.position.x((3 - i) * 58 - 87, 0.9))); elapsed += 1.25;
        yield* all(...addressBytes.map(tile => tile.fill('#B3D8C225', 0.5))); elapsed += 0.5;
      }
      yield* arrow().end(1, 0.6); elapsed += 0.6;
      yield* sequence(0.18, ...code.map(line => line.opacity(1, 0.45))); elapsed += 0.9;
    }

    if (cfg.kind === 'return') {
      const stackBytes: Rect[] = [];
      const stack = createRef<Rect>();
      const address = createRef<Rect>();
      const cpu = createRef<Rect>();
      const pointer = createRef<Txt>();
      const path = createRef<Line>();
      const win = createRef<Rect>();
      const flag = createRef<Txt>();
      const diagnostic = createRef<Txt>();
      stage().add(
        <>
          <Panel ref={stack} x={-600} y={-30} width={650} height={590} stroke={C.red}>
            <Txt text="STACK" x={-245} y={-250} fill={C.muted} fontFamily={MONO} fontSize={18} fontWeight={800} />
            {Array.from({length: 12}).map((_, i) => (
              <Rect ref={makeRef(stackBytes, i)} x={-225 + (i % 4) * 108} y={-135 + Math.floor(i / 4) * 84} width={88} height={64} radius={3} fill={i < 8 ? C.green : C.red} opacity={0} scale={0.4}>
                <Txt text="A" fill={C.bg} fontFamily={MONO} fontSize={21} fontWeight={900} />
              </Rect>
            ))}
            <Rect ref={address} y={170} width={480} height={90} radius={4} fill={C.red} opacity={0}>
              <Txt text="f6  91  04  08" fill={C.bg} fontFamily={MONO} fontSize={29} fontWeight={900} />
            </Rect>
          </Panel>
          <Panel ref={cpu} x={170} y={-55} width={470} height={360} stroke={C.blue}>
            <Txt text="CPU" x={-185} y={-140} fill={C.blue} fontFamily={MONO} fontSize={18} fontWeight={800} />
            <GlassLabel text={cfg.variation === 'redirect' ? 'ret' : 'leave'} x={0} y={-48} width={350} color={C.blue} />
            <Rect y={72} width={350} height={96} radius={4} fill={C.bg2} stroke={C.orange} lineWidth={2}>
              <Txt text="INSTRUCTION POINTER" y={-20} fill={C.muted} fontFamily={MONO} fontSize={15} />
              <Txt ref={pointer} text="0x0804932f" y={22} fill={C.orange} fontFamily={MONO} fontSize={23} fontWeight={800} />
            </Rect>
          </Panel>
          <Panel ref={win} x={665} y={205} width={470} height={310} stroke={C.orange}>
            <Txt text="0x080491f6  win()" y={-105} fill={C.orange} fontFamily={MONO} fontSize={23} fontWeight={800} />
            <CodeLine text={'fopen("flag.txt", "r")'} x={-190} y={-25} size={20} />
            <CodeLine text={'printf(flag)'} x={-190} y={42} size={21} color={C.green} />
            <Txt ref={flag} text="picoCTF{••••••••••}" y={105} fill={C.green} fontFamily={MONO} fontSize={25} fontWeight={800} opacity={0} />
          </Panel>
          <Line ref={path} points={[[350, 18], [480, -160], [600, -160], [665, 50]]} stroke={C.red} lineWidth={4} endArrow arrowSize={15} end={0} />
          <Txt ref={diagnostic} text="Okay, time to return…  Jumping to 0x080491f6" y={330} fill={C.orange} fontFamily={MONO} fontSize={21} opacity={0} />
        </>,
      );
      win().opacity(0.25);
      yield* sequence(0.045, ...stackBytes.map(byte => all(byte.opacity(1, 0.24), byte.scale(1, 0.24)))); elapsed += 0.85;
      yield* address().opacity(1, 0.5); elapsed += 0.5;
      yield* cameraMove(stage(), cfg.camera); elapsed += 1.2;
      if (cfg.variation === 'diagnostic') {
        yield* diagnostic().opacity(1, 0.6); elapsed += 0.6;
        yield* pointer().text('0x080491f6', 0.8); elapsed += 0.8;
      } else {
        yield* pointer().text('0x080491f6', 0.75); elapsed += 0.75;
        yield* path().end(1, 1.1); elapsed += 1.1;
        yield* win().opacity(1, 0.55); elapsed += 0.55;
      }
      if (cfg.variation === 'flag') {
        yield* flag().opacity(1, 0.75); elapsed += 0.75;
        yield* all(stack().opacity(0, 1), cpu().opacity(0.38, 1), stage().position.x(-160, 1), stage().scale(1.18, 1)); elapsed += 1;
      }
    }

    if (cfg.kind === 'recap') {
      const objects: Rect[] = [];
      const arrows: Line[] = [];
      const statement = createRef<Txt>();
      const futures: Rect[] = [];
      const items = [
        ['01', 'FINITE BUFFER', '32 bytes', C.green],
        ['02', 'UNBOUNDED WRITE', 'gets(buf)', C.red],
        ['03', 'CORRUPTED ADDRESS', '0x080491f6', C.orange],
        ['04', 'REDIRECTED POINTER', 'CPU enters win', C.blue],
      ] as const;
      stage().add(
        <>
          {items.map((item, i) => (
            <Rect ref={makeRef(objects, i)} x={-690 + i * 460} y={-55} width={360} height={300} radius={5} fill={C.panel} stroke={C.faint} lineWidth={1} opacity={0}>
              <Rect x={-136} y={-108} width={54} height={54} radius={2} fill={item[3]}><Txt text={item[0]} fill={C.bg} fontFamily={MONO} fontSize={18} fontWeight={900} /></Rect>
              <Txt text={item[1]} x={-136} y={-20} offsetX={-1} fill={C.text} fontFamily={FONT} fontSize={23} fontWeight={700} />
              <Txt text={item[2]} x={-136} y={60} offsetX={-1} fill={item[3]} fontFamily={MONO} fontSize={20} fontWeight={700} />
            </Rect>
          ))}
          {[0, 1, 2].map(i => <Line ref={makeRef(arrows, i)} points={[[-500 + i * 460, -55], [-420 + i * 460, -55]]} stroke={items[i + 1][3]} lineWidth={4} endArrow arrowSize={14} end={0} />)}
          <Txt ref={statement} text="Our text never became code." y={225} fill={C.text} fontFamily={FONT} fontSize={42} fontWeight={800} opacity={0} />
          {['FORMAT STRINGS', 'ROP', 'HEAP CORRUPTION'].map((label, i) => (
            <Rect ref={makeRef(futures, i)} x={-390 + i * 390} y={330} width={330} height={78} radius={4} fill={C.panel2} stroke={i === 1 ? C.orange : C.green} lineWidth={1} opacity={0}>
              <Txt text={label} fill={i === 1 ? C.orange : C.green} fontFamily={MONO} fontSize={18} fontWeight={800} />
            </Rect>
          ))}
        </>,
      );
      yield* sequence(0.14, ...objects.map((object, i) => all(object.opacity(1, 0.45), object.position.y(-55 - (i % 2) * 12, 0.45)))); elapsed += 0.95;
      yield* sequence(0.16, ...arrows.map(arrow => arrow.end(1, 0.45))); elapsed += 0.8;
      yield* cameraMove(stage(), cfg.camera, 0.9); elapsed += 0.9;
      yield* statement().opacity(1, 0.55); elapsed += 0.55;
      if (cfg.variation === 'statement') {
        yield* statement().text('Our text never became code. It changed where code continued.', 1.2); elapsed += 1.2;
      }
      if (cfg.variation === 'future') {
        yield* sequence(0.18, ...futures.map(card => card.opacity(1, 0.5))); elapsed += 0.9;
        yield* all(...objects.map(object => object.opacity(0.18, 0.7))); elapsed += 0.7;
      }
    }

    yield* caption().opacity(1, 0.7); elapsed += 0.7;
    yield* waitFor(2.1);
    yield* all(stage().scale(1.015, 1), stage().position.y(0, 1), stage().rotation(0, 1));
    yield* waitFor(1.8);
    yield* caption().stroke(color, 0.5);
    };

    // Run the detailed animation as a child thread while the scene clock stays exact.
    yield animate();
    yield* waitFor(cfg.duration);
  });
}
