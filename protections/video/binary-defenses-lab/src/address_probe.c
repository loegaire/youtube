#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char **argv) {
    int local = 0;
    void *libc_puts = dlsym(RTLD_NEXT, "puts");

    printf("pid       %ld\n", (long)getpid());
    printf("main      %p\n", (void *)(uintptr_t)&main);
    printf("stack     %p\n", (void *)&local);
    printf("puts-ref  %p\n", (void *)(uintptr_t)&puts);
    printf("libc-puts %p\n", libc_puts);
    fflush(stdout);

    if (argc == 2 && strcmp(argv[1], "--hold") == 0) {
        puts("hold      press Enter to exit");
        (void)getchar();
    }

    return 0;
}
