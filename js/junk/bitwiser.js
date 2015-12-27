/** Invert Bitmask */
~$mask & 0xFF

/** Check flag (where FLAG_CONSTANT is 1,2,4,8, etc...) */
FLAG_CONSTANT & $options

/** Ripping a byte out of a larger number (hopefully we should have this committed to memory by now). */
var red		=	(colour & 0xFF0000) >> 16,
	green	=	(colour & 0x00FF00) >> 8,
	blue	=	(colour & 0x0000FF) >> 0