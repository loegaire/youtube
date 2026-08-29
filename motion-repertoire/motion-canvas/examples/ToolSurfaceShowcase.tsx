import {Rect} from '@motion-canvas/2d';
import {
  THINH_TOOL_THEME as T,
  ThinhBurp,
  ThinhEditor,
  ThinhGdb,
  ThinhIDA,
  ThinhTerminal,
  ThinhWireshark,
} from '../src/toolSurfaces';

export const TOOL_SURFACE_KINDS = [
  'terminal',
  'gdb',
  'ida',
  'burp',
  'editor',
  'wireshark',
] as const;

export type ToolSurfaceKind = typeof TOOL_SURFACE_KINDS[number];

/**
 * Visual QA fixture only. Replace all sample rows with captured project evidence
 * before using a surface in a factual video.
 */
export function ToolSurfaceShowcase({kind}: {kind: ToolSurfaceKind}) {
  return (
    <Rect width={1920} height={1080} fill={T.background}>
      {kind === 'terminal' ? (
        <ThinhTerminal
          width={1640}
          height={860}
          context={'challenge / recon'}
          activeLine={4}
          lines={[
            {text: 'file ./challenge', prompt: '$'},
            {text: 'ELF 32-bit LSB executable, Intel 80386', prompt: '', tone: 'muted'},
            {text: 'checksec --file=./challenge', prompt: '$'},
            {text: 'NX enabled · PIE disabled · no canary', prompt: '', tone: 'warning'},
            {text: 'gdb -q ./challenge', prompt: '$', tone: 'active'},
            {text: 'Reading symbols from ./challenge...', prompt: '', tone: 'muted'},
          ]}
        />
      ) : null}
      {kind === 'gdb' ? (
        <ThinhGdb
          width={1640}
          height={860}
          activeInstruction={2}
          registers={[
            {name: 'EAX', value: '0x41414141', changed: true},
            {name: 'EBX', value: '0x00000000'},
            {name: 'ECX', value: '0xffffd120'},
            {name: 'EDX', value: '0x00000000'},
            {name: 'ESP', value: '0xffffd0fc'},
            {name: 'EIP', value: '0x08048492', changed: true},
          ]}
          instructions={[
            {address: '0804848a', mnemonic: 'call', operands: 'gets@plt'},
            {address: '0804848f', mnemonic: 'leave'},
            {address: '08048490', mnemonic: 'ret', current: true},
            {address: '08048491', mnemonic: 'nop'},
            {address: '08048492', mnemonic: 'push', operands: 'ebp'},
          ]}
          stack={[
            {address: 'ffffd0fc', value: '08048492'},
            {address: 'ffffd100', value: '41414141'},
            {address: 'ffffd104', value: 'ffffd150'},
            {address: 'ffffd108', value: '00000000'},
          ]}
          command={'x/4wx $esp'}
          output={'0xffffd0fc: 0x08048492 0x41414141 0xffffd150 0x00000000'}
        />
      ) : null}
      {kind === 'ida' ? (
        <ThinhIDA
          width={1640}
          height={860}
          activeFunction={2}
          activeCodeLine={4}
          activeListing={3}
          functions={[
            {name: 'main', address: '08048420'},
            {name: 'setup', address: '08048452'},
            {name: 'vuln', address: '08048480'},
            {name: 'gets@plt', address: '08048310'},
            {name: 'exit@plt', address: '08048330'},
          ]}
          pseudocode={[
            {text: 'void vuln(void) {'},
            {text: '  char local_1c[16];', tone: 'warning'},
            {text: '  puts("GIVE ME YOUR NAME!");'},
            {text: '  gets(local_1c);', tone: 'danger'},
            {text: '  return;', tone: 'active'},
            {text: '}'},
          ]}
          listing={[
            {address: '08048480', text: 'push ebp'},
            {address: '08048481', text: 'mov ebp, esp'},
            {address: '08048483', text: 'sub esp, 0x18'},
            {address: '0804848a', text: 'call gets@plt', tone: 'danger'},
            {address: '0804848f', text: 'leave'},
            {address: '08048490', text: 'ret', tone: 'warning'},
          ]}
        />
      ) : null}
      {kind === 'burp' ? (
        <ThinhBurp
          width={1640}
          height={860}
          activeRequest={1}
          history={[
            {method: 'GET', host: 'challenge.local', path: '/', status: 200, length: 1248},
            {method: 'POST', host: 'challenge.local', path: '/login', status: 302, length: 0},
            {method: 'GET', host: 'challenge.local', path: '/admin', status: 403, length: 312},
            {method: 'POST', host: 'challenge.local', path: '/api/search', status: 200, length: 904},
          ]}
          request={[
            {text: 'POST /login HTTP/1.1', tone: 'warning'},
            {text: 'Host: challenge.local'},
            {text: 'Content-Type: application/x-www-form-urlencoded', tone: 'muted'},
            {text: ''},
            {text: 'username=guest&password=guest'},
          ]}
          response={[
            {text: 'HTTP/1.1 302 Found', tone: 'active'},
            {text: 'Location: /dashboard'},
            {text: 'Set-Cookie: session=…; HttpOnly', tone: 'warning'},
            {text: 'Content-Length: 0', tone: 'muted'},
          ]}
        />
      ) : null}
      {kind === 'editor' ? (
        <ThinhEditor
          width={1640}
          height={860}
          language={'C / challenge.c'}
          activeFile={2}
          activeLine={9}
          files={[
            {name: 'challenge', open: true},
            {name: 'src', depth: 1, open: true},
            {name: 'challenge.c', depth: 2},
            {name: 'solve.py', depth: 1},
            {name: 'README.md', depth: 1},
          ]}
          code={[
            {text: '#include <stdio.h>', tone: 'muted'},
            {text: '#include <unistd.h>', tone: 'muted'},
            {text: ''},
            {text: '#define BUFSIZE 16', tone: 'warning'},
            {text: ''},
            {text: 'void vuln(void) {'},
            {text: '    char buf[BUFSIZE];', tone: 'warning'},
            {text: '    puts("GIVE ME YOUR NAME!");'},
            {text: '    gets(buf);', tone: 'danger'},
            {text: '}', tone: 'active'},
            {text: ''},
            {text: 'int main(void) {'},
            {text: '    vuln();'},
            {text: '}'},
          ]}
        />
      ) : null}
      {kind === 'wireshark' ? (
        <ThinhWireshark
          width={1640}
          height={860}
          activePacket={3}
          packets={[
            {time: '0.000', source: '10.0.0.12', destination: '10.0.0.8', protocol: 'TCP', info: '54218 → 80 [SYN]'},
            {time: '0.012', source: '10.0.0.8', destination: '10.0.0.12', protocol: 'TCP', info: '80 → 54218 [SYN, ACK]'},
            {time: '0.021', source: '10.0.0.12', destination: '10.0.0.8', protocol: 'HTTP', info: 'GET /api/status'},
            {time: '0.034', source: '10.0.0.8', destination: '10.0.0.12', protocol: 'HTTP', info: 'HTTP/1.1 200 OK'},
            {time: '0.061', source: '10.0.0.12', destination: '10.0.0.8', protocol: 'TCP', info: '54218 → 80 [ACK]'},
          ]}
          details={[
            {text: '▾ Hypertext Transfer Protocol', tone: 'active'},
            {text: '  HTTP/1.1 200 OK'},
            {text: '  Content-Type: application/json', tone: 'muted'},
            {text: '  Content-Length: 42', tone: 'warning'},
          ]}
          bytes={[
            '0000  48 54 54 50 2f 31 2e 31',
            '0008  20 32 30 30 20 4f 4b 0d',
            '0010  0a 43 6f 6e 74 65 6e 74',
            '0018  2d 54 79 70 65 3a 20 61',
          ]}
        />
      ) : null}
    </Rect>
  );
}

