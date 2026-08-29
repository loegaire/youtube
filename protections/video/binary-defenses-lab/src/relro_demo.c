#include <stdio.h>
#include <unistd.h>

static void marker(const char *text, size_t length) {
    (void)write(STDERR_FILENO, text, length);
}

int main(void) {
    static const char entered[] = "PROGRAM: entered main\n";
    static const char before[] = "PROGRAM: before first puts\n";
    static const char after[] = "PROGRAM: after first puts\n";

    marker(entered, sizeof entered - 1);
    marker(before, sizeof before - 1);
    puts("hello from puts");
    marker(after, sizeof after - 1);
    sleep(2);
    return 0;
}
