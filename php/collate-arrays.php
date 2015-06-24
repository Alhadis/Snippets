<?php

/**
 * Converts a list of associative arrays into indexed arrays.
 *
 * Each property name is collated within an extra array inserted at the beginning
 * of the returned array, structuring the data in a CSV-like fashion. For example:
 *
 *   array(
 *       array('first_name' => 'John',   'last_name' => 'Gardner',   'age' => 28),
 *       array('first_name' => 'Sum',    'last_name' => 'Kunt',      'age' => 25)
 *   )
 *
 * Would be returned as:
 *
 *   array(
 *       array('first_name', 'last_name',    'age'),
 *       array('John',       'Gardner',      28),
 *       array('Sum',        'Kunt',         25)
 *   )
 *
 * Properties are indexed in the order they're encountered when traversing the original data
 * list, with any missing properties assigned empty values if they're present in some rows
 * but absent in others. For instance, consider the following inconsistent data structure,
 * with two rows sharing only partial similarity:
 *
 *   array(
 *       array('first_name' => 'John',   'age' =>  28),
 *       array('first_name' => 'Sum',    'dob' => '1990-08-20')
 *   )
 *
 * These would be collated and returned as:
 *
 *   array(
 *       array('first_name',   'age',    'dob'),
 *       array('John',         '28',      NULL),
 *       array('Sum',           NULL,    '1990-08-20')
 *   )
 *
 * This ensures data will be ordered in a consistent format, and can help reduce latency
 * and bandwidth costs when sending large payloads of JSON-encoded data.
 *
 * @param array $data - A multidimensional array to operate upon
 * @return array
 */
function collate_arrays($data){
	$output		=	array();

	# First, cycle through each row to extract a list of every unique field name that's present.
	$fields		=	array();
	$count		=	0;

	foreach($data as $row){
		foreach($row as $name => $value)
			if(!isset($fields[$name]))
				$fields[$name]	=	$count++;
	}


	# Flip the list of field names and store them in the first row of the returned array.
	$fields		=	array_flip($fields);
	$output[]	=	$fields;


	# Next, run through the array again, ensuring every array and its properties are consistently indexed in running field order.
	foreach($data as $row){
		$indexed_row = array();

		for($i = 0; $i < $count; ++$i)
			$indexed_row[$i] = $row[$fields[$i]];

		$output[]	=	$indexed_row;
	}

	return $output;
}


# Sample use below (with a particularly extreme example)
$messy_array	=	array(
	array('last_name'   => 'Gardner',  'first_name' => 'John',         'dob'           => '1987-04-18',    'age'       =>   28),
	array('first_name'  => 'John',     'last_name'  => 'Gardner',      'age'           =>  28,             'dob'       =>  '1987-04-18'),
	array('first_name'  => 'John',     'last_name'  => 'Gardner',      'age'           =>  28,             'dob'       =>  '1987-04-18'),
	array('first_name'  => 'John',     'last_name'  => 'Gardner',      'age'           =>  28,             'dob'       =>  '1987-04-18'),
	array('age'         =>  28,        'dob'        => '1987-04-18',   'first_name'    => 'John',          'last_name' =>  'Gardner'),
	array(
		'txtFirstName'  => 'John',
		'last_name'     => 'GARDNER',
		'txtLastName'   => 'Gardner',
		'txtAge'        =>  28,
		'dobYear'       =>  1987,
		'dobMonth'      =>  4,
		'dobDay'        =>  18
	),
	array('first_name'  =>  'John',     'last_name' =>  'Gardner',     'age'    =>  28,     'dob'   => '1987-04-18'),
	array('first_name'  =>  'John',     'last_name' =>  'Gardner',     'age'    =>  28,     'dob'   => '1987-04-18'),
	array('first_name'  =>  'John',     'last_name' =>  'Gardner',                          'dob'   => '1987-04-18'),
	array('first_name'  =>  'John',     'last_name' =>  'Gardner',     'age'    =>  28)
);



header('Content-Type: text/plain; charset=UTF-8');
error_reporting(E_ALL ^ E_NOTICE);

$sorted	=	collate_arrays($messy_array);
print_r($sorted);
