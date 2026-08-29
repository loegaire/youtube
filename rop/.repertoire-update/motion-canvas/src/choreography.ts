import {Line, Node} from '@motion-canvas/2d';
import {
  all,
  easeInCubic,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  sequence,
} from '@motion-canvas/core';

export type MotionNode = Node | Line;

export type CameraMove =
  | 'push'
  | 'pull'
  | 'track-left'
  | 'track-right'
  | 'tilt-left'
  | 'tilt-right'
  | 'drop'
  | 'rise';

export function cameraTravel(stage: Node, move: CameraMove, duration = 1.05) {
  const pose = {
    push: {x: 0, y: 2, scale: 1.085, rotation: 0},
    pull: {x: 0, y: -2, scale: 0.91, rotation: 0},
    'track-left': {x: 115, y: 0, scale: 1.02, rotation: -0.35},
    'track-right': {x: -115, y: 0, scale: 1.02, rotation: 0.35},
    'tilt-left': {x: 48, y: 18, scale: 1.035, rotation: -1.1},
    'tilt-right': {x: -48, y: 18, scale: 1.035, rotation: 1.1},
    drop: {x: 0, y: -82, scale: 1.04, rotation: 0},
    rise: {x: 0, y: 82, scale: 0.97, rotation: 0},
  }[move];
  return all(
    stage.position.x(pose.x, duration, easeInOutCubic),
    stage.position.y(pose.y, duration, easeInOutCubic),
    stage.scale(pose.scale, duration, easeInOutCubic),
    stage.rotation(pose.rotation, duration, easeInOutCubic),
  );
}

export function prepareEntrance(stage: Node, move: CameraMove) {
  const pose = {
    push: {x: 0, y: 36, scale: 0.78, rotation: 0},
    pull: {x: 0, y: -20, scale: 1.22, rotation: 0},
    'track-left': {x: 340, y: 0, scale: 0.96, rotation: -1.1},
    'track-right': {x: -340, y: 0, scale: 0.96, rotation: 1.1},
    'tilt-left': {x: 180, y: 40, scale: 0.9, rotation: -3.5},
    'tilt-right': {x: -180, y: 40, scale: 0.9, rotation: 3.5},
    drop: {x: 0, y: -240, scale: 0.95, rotation: 0},
    rise: {x: 0, y: 240, scale: 0.95, rotation: 0},
  }[move];
  stage.position([pose.x, pose.y]);
  stage.scale(pose.scale);
  stage.rotation(pose.rotation);
  stage.opacity(0);
}

export function enterStage(stage: Node, duration = 0.72) {
  return all(
    stage.opacity(1, duration, easeOutCubic),
    stage.position([0, 0], duration, easeOutCubic),
    stage.scale(1, duration, easeOutBack),
    stage.rotation(0, duration, easeOutCubic),
  );
}

export function exitStage(stage: Node, move: CameraMove, duration = 0.52) {
  const pose = {
    push: {x: 0, y: -20, scale: 1.26, rotation: 0},
    pull: {x: 0, y: 12, scale: 0.74, rotation: 0},
    'track-left': {x: -390, y: 0, scale: 0.96, rotation: -1.6},
    'track-right': {x: 390, y: 0, scale: 0.96, rotation: 1.6},
    'tilt-left': {x: -260, y: -70, scale: 0.84, rotation: -5},
    'tilt-right': {x: 260, y: -70, scale: 0.84, rotation: 5},
    drop: {x: 0, y: 310, scale: 0.92, rotation: 0},
    rise: {x: 0, y: -310, scale: 0.92, rotation: 0},
  }[move];
  return all(
    stage.opacity(0, duration, easeInCubic),
    stage.position([pose.x, pose.y], duration, easeInCubic),
    stage.scale(pose.scale, duration, easeInCubic),
    stage.rotation(pose.rotation, duration, easeInCubic),
  );
}

export function cascadeIn(nodes: MotionNode[], stagger = 0.1, duration = 0.48) {
  nodes.forEach((node, index) => {
    node.opacity(0);
    node.position.y(node.position.y() + 34 + (index % 2) * 12);
    node.scale(0.9);
  });
  return sequence(
    stagger,
    ...nodes.map(node => all(
      node.opacity(1, duration, easeOutCubic),
      node.position.y(node.position.y() - 34, duration, easeOutCubic),
      node.scale(1, duration, easeOutBack),
    )),
  );
}

export function fanIn(nodes: MotionNode[], duration = 0.75) {
  const targets = nodes.map(node => ({
    x: node.position.x(),
    y: node.position.y(),
    rotation: node.rotation(),
  }));
  nodes.forEach((node, index) => {
    node.position([0, 80]);
    node.rotation((index - nodes.length / 2) * 8);
    node.opacity(0);
  });
  return all(...nodes.map((node, index) => all(
    node.opacity(1, duration + index * 0.04, easeOutCubic),
    node.position(
      [targets[index].x, targets[index].y],
      duration + index * 0.04,
      easeOutBack,
    ),
    node.rotation(
      targets[index].rotation,
      duration + index * 0.04,
      easeOutCubic,
    ),
  )));
}

export function drawPaths(lines: Line[], stagger = 0.12, duration = 0.58) {
  lines.forEach(line => line.end(0));
  return sequence(
    stagger,
    ...lines.map(line => line.end(1, duration, easeInOutCubic)),
  );
}

/**
 * Keep a relationship line attached while either endpoint moves.
 * Render the returned Line behind its targets (for example zIndex={-10}) so
 * the connector never crosses the target label.
 */
export function trackedPoints(from: () => Node, to: () => Node) {
  return () => {
    const start = from().position();
    const end = to().position();
    return [
      [start.x, start.y] as [number, number],
      [end.x, end.y] as [number, number],
    ];
  };
}

export function sweep(nodes: MotionNode[], distance = 120, duration = 0.9) {
  return all(...nodes.map((node, index) =>
    node.position.x(
      node.position.x() + (index % 2 ? -distance : distance),
      duration,
      easeInOutCubic,
    ),
  ));
}
