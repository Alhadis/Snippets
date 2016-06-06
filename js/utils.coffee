{toString} = Object.prototype


# Uppercase the first letter of a string
ucFirst = (value) ->
	value.replace /\b(\w)(.*$)/g, (match, firstLetter, remainder) ->
		firstLetter.toUpperCase() + remainder

# Type-checking helpers
isArray  = (value) -> "[object Array]"  is toString.call(value)
isObject = (value) -> "[object Object]" is toString.call(value)
isString = (value) -> "[object String]" is toString.call(value)
isRegExp = (value) -> "[object RegExp]" is toString.call(value)


# Escape special regex characters within a string
escapeRegExp = (string) ->
	string.replace /([/\\^$*+?{}\[\]().|])/g, "\\$1"


# Generate a regex to match a string, bypassing intermediate punctuation.
fuzzyRegExp = (input, keepString) ->
	return input unless isString input
	
	output = input
		.replace(/([A-Z])([A-Z]+)/g, (a, b, c) -> b + c.toLowerCase())
		.split(/\B(?=[A-Z])|[-\s]/g)
		.map (i) -> i.replace(/[/\\^$*+?{}\[\]().|]/g, "[^A-Za-z\\d]*")
		.join("[\\W_\\s]*")
		.replace(/[0Oo]/g, "[0o]")
	
	# Author's requested the regex source, so return a string
	if keepString then return output
	
	# Otherwise, crank the fuzz
	new RegExp output, "i"


# Recursively check if two values are equal
equal = (A, B) ->
	
	# Arrays
	if isArray A
		if isArray B
			for value, index in A
				return false unless equal(value, B[index])
		else false
	
	# Vanilla objects
	else if isObject A
		if isObject B
			for key, value of A
				return false unless equal(value, B[key])
		else false
	
	# Regular expressions
	else if isRegExp A
		if isRegExp B
			flags   = /[gmiyu]*$/
			A_flags = A.toString().match(flags)[0].split("").sort().join("")
			B_flags = B.toString().match(flags)[0].split("").sort().join("")
			return true if A.source is B.source and A_flags is B_flags
		return false

	# Two NaNs
	else if ((A isnt A) and (B isnt B)) then true

	# Anything else
	else if A isnt B then false
	
	else true


# Export
module.exports = {
	equal
	escapeRegExp
	fuzzyRegExp
	isArray
	isRegExp
	isString
	isObject
	ucFirst
}
