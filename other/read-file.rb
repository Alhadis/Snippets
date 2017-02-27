#!/usr/bin/ruby

data = File.read("file.name")

if /^pattern/.match(data)
	puts("MATCHES")
end
