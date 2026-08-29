#include <stdio.h>
#include <unistd.h>

__attribute__((noinline))
static void greet(void) {
    char name[32];

    puts("name:");
    ssize_t count = read(STDIN_FILENO, name, 128);
    printf("read %zd bytes\n", count);
}

int main(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    greet();
    return 0;
}
