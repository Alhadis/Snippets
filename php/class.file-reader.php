<?php

/**
 * A suite of methods for reading and handling file formats and data.
 *
 * @author John Gardner <gardnerjohng@gmail.com>
 * Original Version: 2009/09/19 6:32:30 PM (GMT+10)
 */
class FileReader{
	
	
	/**
	 * Scan the file's content type, as recognised by the server's system() command.
	 *
	 * @param string $file The file's URL.
	 * @param bool $filter Whether to run the output through the clarify method before returning the result.
	 * @param string $dump Path to store the contents of the system's output. This path shouldn't exist; otherwise, any files matching the URL will be deleted upon execution.
	 * @return string The analysed result, or an empty string if an invalid argument was supplied.
	 */
	public static function scan($file, $filter = true, $dump = "output_text.txt"){
		$output = "";
		
		# First make sure file exists
		if(is_file($file)){
			
			# Delete any existing file with the $dump name to ensure we're reading from a fresh file, and not dumping data on top of it.
			@unlink($dump);
			
			# Next, create a new file and execute the system command.
			$command = "file -b '" . $file . "' > ".$dump;
			$handle  = @fopen($dump, "w+");
			system($command);
			
			# Then read the contents of the file dump.
			$output  = fread($handle, filesize($dump));
			fclose($handle);
			
			# Erase the file once finished
			@unlink($dump);
			
			$output  = $filter ? FileReader::clarify($output, $file) : $output;
		}
		
		return $output;
	}



	public static function parseHTMLTypes($type, $ext){
		$output = $type;
		switch($ext){
			# Hypertext Markup Documents
			case "htm":
			case "html":
			case "hta":
			case "htc":
			case "xhtml":
				$output = "HTML Document";
				break;

			# Server-Side Includes
			case "shtm": case "shtml": case "stm": case "ssi": case "inc":
				$output = "Server-Side Include";
				break;
		}
		return $output;
	}


	/**
	 * Clarify (or correct) the read-out returned by reader's scan method.
	 *
	 * @param string $type The string representing the scanned file's contents.
	 * @param string $file Path to the original file.
	 * @return string Returns the $type argument if no apparent correction was found (or necessary).
	 */
	public static function clarify($type, $file){
		
		# Default return value
		$output = $type;
		
		# File Extension
		$ext    = strtolower(end(explode(".", $file)));



		//=======================================================================================
		//      REINTERPRETATIONS
		//
		//  *   Statement blocks for re-interpreting / correcting missing or erroneous filetypes.
		//=======================================================================================

			/**
			 * Ambigous MSO Definitions
			 *
			 * Because some program-specific filetypes can be erroneously marked as a Microsoft Office Document
			 * on some systems, thorough classification is necessary for properly identifying some filetypes.
			 */
			if(strpos($type, "Microsoft Office Document") !== FALSE) switch($ext){
				case "fla": $output = "Flash Project File";         break;
				case "max": $output = "3DS Max Scene";              break;
				case "doc": $output = "Microsoft Word Document";    break;
			}


			# PDFs
			else if(strpos($type, "PDF document") !== FALSE) switch($ext){
				case "ai":  $output = "Adobe Illustrator Document"; break;
				case "pdf": $output = "Adobe Acrobat PDF";          break;
			}


			# HTML / PHP Documents
			else if(strpos($type, "HTML document") !== FALSE || strpos($type, "PHP") !== FALSE){
				$output = Filereader::parseHTMLTypes($type, $ext);
				switch($ext){
					case "php": $output = "PHP Document"; break;
				}
			}


			/**
			 * ASCII Files
			 *
			 * Because "ASCII" could mean a wide range of different types, this particular result requires specific scrutiny.
			 */
			else if(strpos($type, "ASCII") !== FALSE){
				$output = Filereader::parseHTMLTypes($type, $ext);
				switch($ext){
					case "css": $output = "Cascading Style Sheet";      break;
					case "txt": $output = "Text File";                  break;
					case "js":  $output = "JavaScript File";            break;
					case "lws": $output = "Lightwave 3D Scene";         break;
					case "lwo": $output = "Lightwave 3D Object";        break;
					case "ms":  $output = "3dsMax maxscript file";      break;
				}
			}


			# Java
			else if(strpos($type, "Unicode Java program text") !== FALSE) switch($ext){
				case "as": $output = "Flash ActionScript File"; break;
			}

			
			# Compressed ZIP Files
			else if(strpos($type, "Zip archive") !== FALSE) switch($ext){
				case "zip": $output = "Compressed ZIP Archive"; break;
			}


			# Lightwave 3D
			else if(strpos($type, "LWO2") !== FALSE) switch($ext){
				case "lws":
					if(strpos($type, "3-D Object") === FALSE)
					$output = "Lightwave 3D Scene";
				break;
				
				case "lwo":
					$output = "Lightwave 3D Object";
				break;
			}
			




		//=======================================================================================
		//      SHORTHAND
		//
		//  *   Not used to clarify or reinterpret file types, but rather shorten
		//      the output to a more readable string.
		//=======================================================================================
		
			# Truevision Targa
			else if(strpos($type, "Targa") !== FALSE) $output = "Truevision Targa";


			/**
			 * Word documents interpreted as "CDF" files (Windows Compound Binary File Format Specification)
			 * @link http://stackoverflow.com/questions/4914990/why-does-the-file-utility-identify-microsoft-word-files-as-cdf-what-is-this-cdf
			 */
			else if(strpos($type, "Microsoft") !== FALSE && preg_match("#^CDF V\d Document#i", $type)) switch($ext){
				case "doc": $output = "Microsoft Word Document"; break;
			}


		return $output;
	}



}
