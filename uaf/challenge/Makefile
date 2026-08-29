CC := gcc
CFLAGS := -m32 -O0 -g -fno-pie -fstack-protector-all
LDFLAGS := -m32 -no-pie -Wl,-z,relro

.PHONY: all clean

all: vuln

vuln: vuln.c
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ $<

clean:
	$(RM) vuln
