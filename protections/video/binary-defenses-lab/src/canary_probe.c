#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>

__attribute__((noinline))
static void probe(void) {
    char buffer[16] = {0};
    uintptr_t tls_guard = 0;
    uintptr_t frame_copy = 0;

#if defined(__x86_64__)
    __asm__ volatile("mov %%fs:0x28, %0" : "=r"(tls_guard));
    __asm__ volatile("mov -8(%%rbp), %0" : "=r"(frame_copy));
#endif

    printf("buffer     %p\n", (void *)buffer);
    printf("tls-guard  0x%016" PRIxPTR "\n", tls_guard);
    printf("frame-copy 0x%016" PRIxPTR "\n", frame_copy);
}

int main(void) {
    probe();
    return 0;
}
