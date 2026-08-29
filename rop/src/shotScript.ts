export type ShotSpace =
  | 'microscope'
  | 'conveyor'
  | 'route'
  | 'code-map'
  | 'terminal'
  | 'shards'
  | 'typography'
  | 'stack'
  | 'split'
  | 'boundary'
  | 'memory'
  | 'register'
  | 'orbit'
  | 'stair'
  | 'workflow'
  | 'source'
  | 'decompiler';

export type CameraMove =
  | 'push'
  | 'pull'
  | 'track-left'
  | 'track-right'
  | 'tilt-left'
  | 'tilt-right'
  | 'drop'
  | 'rise';

export interface ShotDirection {
  technique: string;
  space: ShotSpace;
  camera: CameraMove;
}

/**
 * Every narration beat has its own visual direction.  The space may be reused,
 * but the technique name and camera move express the script-specific action.
 * This is intentionally explicit: a new video must earn its staging from its
 * script instead of inheriting one dashboard layout.
 */
export const SHOT_DIRECTIONS: Record<string, ShotDirection> = {
  'intro-01': {technique: 'glyph microscope', space: 'microscope', camera: 'push'},
  'intro-02': {technique: 'row to stack', space: 'conveyor', camera: 'tilt-right'},
  'intro-03': {technique: 'steering fork', space: 'route', camera: 'track-right'},
  'intro-04': {technique: 'code map flight', space: 'code-map', camera: 'push'},
  'intro-05': {technique: 'search scan', space: 'terminal', camera: 'track-left'},
  'intro-06': {technique: 'gadget finder extraction', space: 'decompiler', camera: 'pull'},
  'intro-07': {technique: 'bytes versus addresses', space: 'split', camera: 'rise'},

  'return-01': {technique: 'ret macro lens', space: 'stack', camera: 'push'},
  'return-02': {technique: 'call compresses into address', space: 'code-map', camera: 'track-right'},
  'return-03': {technique: 'pop transfer', space: 'conveyor', camera: 'push'},
  'return-04': {technique: 'address carousel', space: 'orbit', camera: 'tilt-left'},
  'return-05': {technique: 'parallel control paths', space: 'route', camera: 'pull'},

  'challenge-01': {technique: 'challenge analysis workflow', space: 'workflow', camera: 'push'},
  'challenge-02': {technique: 'full source to vulnerable function', space: 'source', camera: 'drop'},
  'challenge-03': {technique: 'overflow conveyor', space: 'conveyor', camera: 'track-left'},
  'challenge-04': {technique: 'payload unroll', space: 'stair', camera: 'pull'},
  'challenge-05': {technique: 'return loop', space: 'orbit', camera: 'tilt-right'},

  'nx-01': {technique: 'shellcode dive', space: 'stack', camera: 'drop'},
  'nx-02': {technique: 'fetch decode pipeline', space: 'route', camera: 'track-right'},
  'nx-03': {technique: 'permission wall', space: 'boundary', camera: 'push'},
  'nx-04': {technique: 'memory map tilt', space: 'memory', camera: 'tilt-left'},
  'nx-05': {technique: 'execution reroute', space: 'route', camera: 'rise'},

  'gadgets-01': {technique: 'decompiler to instruction crop', space: 'decompiler', camera: 'push'},
  'gadgets-02': {technique: 'stack consume', space: 'conveyor', camera: 'track-left'},
  'gadgets-03': {technique: 'double effect', space: 'split', camera: 'pull'},
  'gadgets-04': {technique: 'schedule bridge', space: 'route', camera: 'tilt-right'},
  'gadgets-05': {technique: 'endian decode', space: 'microscope', camera: 'push'},

  'target-01': {technique: 'register vacuum', space: 'register', camera: 'pull'},
  'target-02': {technique: 'abi router', space: 'orbit', camera: 'tilt-left'},
  'target-03': {technique: 'target lock', space: 'register', camera: 'push'},
  'target-04': {technique: 'dependency build', space: 'stair', camera: 'rise'},

  'write-01': {technique: 'pointer chase', space: 'memory', camera: 'track-right'},
  'write-02': {technique: 'writable landing', space: 'memory', camera: 'drop'},
  'write-03': {technique: 'chunk split', space: 'split', camera: 'pull'},
  'write-04': {technique: 'three step orbit', space: 'orbit', camera: 'tilt-right'},
  'write-05': {technique: 'pop value into eax', space: 'conveyor', camera: 'push'},
  'write-06': {technique: 'return address launch', space: 'route', camera: 'track-left'},
  'write-07': {technique: 'pointer placement', space: 'memory', camera: 'track-right'},
  'write-08': {technique: 'register pours into memory', space: 'memory', camera: 'push'},
  'write-09': {technique: 'write block compression', space: 'typography', camera: 'pull'},
  'write-10': {technique: 'repeat write', space: 'conveyor', camera: 'track-right'},
  'write-11': {technique: 'terminator scan', space: 'microscope', camera: 'track-left'},
  'write-12': {technique: 'pointer solidifies', space: 'memory', camera: 'rise'},

  'register-01': {technique: 'payload changes jobs', space: 'split', camera: 'tilt-left'},
  'register-02': {technique: 'eax assignment', space: 'register', camera: 'push'},
  'register-03': {technique: 'pointer versus value', space: 'split', camera: 'track-right'},
  'register-04': {technique: 'null twins', space: 'register', camera: 'pull'},
  'register-05': {technique: 'multi pop chute', space: 'conveyor', camera: 'drop'},
  'register-06': {technique: 'wrong order rewind', space: 'conveyor', camera: 'track-left'},
  'register-07': {technique: 'esp scroll', space: 'stack', camera: 'drop'},
  'register-08': {technique: 'contract snap', space: 'register', camera: 'push'},

  'syscall-01': {technique: 'final slot launch', space: 'stack', camera: 'rise'},
  'syscall-02': {technique: 'mode crossing', space: 'boundary', camera: 'drop'},
  'syscall-03': {technique: 'filename resolve', space: 'memory', camera: 'push'},
  'syscall-04': {technique: 'prompt reclassification', space: 'terminal', camera: 'pull'},
  'syscall-05': {technique: 'ret spiral', space: 'orbit', camera: 'tilt-right'},
  'syscall-06': {technique: 'nx path contrast', space: 'split', camera: 'track-left'},

  'ret2win-01': {technique: 'one jump', space: 'route', camera: 'push'},
  'ret2win-02': {technique: 'chain staircase', space: 'stair', camera: 'drop'},
  'ret2win-03': {technique: 'gadget search', space: 'terminal', camera: 'track-right'},
  'ret2win-04': {technique: 'history becomes future', space: 'stack', camera: 'rise'},

  'deep-01': {technique: 'human machine wipe', space: 'split', camera: 'track-left'},
  'deep-02': {technique: 'rules compose', space: 'orbit', camera: 'push'},
  'deep-03': {technique: 'deterministic step', space: 'conveyor', camera: 'track-right'},
  'deep-04': {technique: 'injection versus reuse', space: 'split', camera: 'pull'},

  'outro-01': {technique: 'chain zoom out', space: 'route', camera: 'pull'},
  'outro-02': {technique: 'order unroll', space: 'typography', camera: 'rise'},
  'outro-03': {technique: 'ret domino', space: 'stair', camera: 'track-right'},
  'outro-04': {technique: 'libc expansion', space: 'memory', camera: 'pull'},
  'outro-05': {technique: 'terminal collapse', space: 'terminal', camera: 'push'},
};
