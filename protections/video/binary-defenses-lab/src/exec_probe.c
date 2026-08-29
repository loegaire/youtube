#include <stdio.h>

typedef int (*code_fn)(void);

int main(void) {
    /* x86-64: mov eax, 42 ; ret */
    unsigned char code[] = {0xb8, 0x2a, 0x00, 0x00, 0x00, 0xc3};

    printf("code buffer: %p\n", (void *)code);
    puts("calling bytes stored on the stack...");
    int result = ((code_fn)(void *)code)();
    printf("returned: %d\n", result);
    return 0;
}
