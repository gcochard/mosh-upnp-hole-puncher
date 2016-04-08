# mosh-upnp-hole-puncher

This package reads the output from `mosh-server new` and
detects the port, then finds your local machine's internal
ip address and runs `upnpc` to dynamically forward that port
to your local system. This allows you to run mosh without
opening up all of 60000-61000 to the world.

Requires node >=v0.10 and miniupnpc installed on the system.
