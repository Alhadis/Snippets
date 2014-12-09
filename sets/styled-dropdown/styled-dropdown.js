var StyledDropdown	=	function(a, b){

	/** Arbitrate our constructor arguments. */
	var node, args;

	/** Check if we were passed a DOM reference or jQuery selector/object as our first argument. */
	if("string" === typeof a || a instanceof Node || a instanceof jQuery)
		node	=	a,
		args	=	b;


	/** If not, assume it's stored in an object hash passed as the first argument. */
	else
		node	=	a.node,
		args	=	a;




	this.node	=	$(node || this.node);

	/** Merge any additional options passed to the constructor. */
	$.extend(this, args);

	/** Store some variables for reference inside our trigger handler below. */
	var $this	=	this,
		items	=	this.items;


	/** Hook into the DOM */
	this.list		=	$(this.list, this.node);
	this.items		=	$(this.items, this.list);
	this.menu		=	$(this.menu, this.node);


	this.items.each(function(i){

		/** Supplied a string: use the value of the property with a matching name. */
		if("string" === typeof $this.valueGetter)
			this[$this.valueName]	=	this[$this.valueGetter];

		/** Supplied a function: run it and use the returned value. */
		else if("function" === typeof $this.valueGetter)
			this[$this.valueName]	=	$this.valueGetter.call(this, i);


		/** Default: use the index of the current iteration instead. */
		else
			this[$this.valueName]	=	i;
	});


	/** We need to ensure both lists are kept in sync with each other, so add a handler to the <select> node to update our HTML tree when changed. */
	this.menu.change(function(e){
		$this.set(this.value, true);
	});

	$(this.trigger, this.items).on(this.triggerType, null, function(e){
		$this.set(this);
		e.stopImmediatePropagation();
		e.preventDefault();
		return false;
	});


	/** Set the dropdown's initial value to whatever the <select> node is. */
	this.set(this.menu.val());
};

$.extend(StyledDropdown.prototype, {

	/** Default selectors */
	node:				".styled-dropdown",
	list:				"ul",
	items:				"> *",
	menu:				"select",

	trigger:			"a",
	triggerType:		"click",


	/** Class to be applied to selected items. */
	selectedClass:		"selected",

	/** Class applied to unselected items */
	unselectedClass:	null,



	/*	Function or property name that maps the styled dropdown items to the values stored in the hidden <select> element. */
	valueGetter:	function(){return $.text(this)},

	/*	Name of property stored on each styled HTML node used for storing the mapped values passed by valueFn */
	valueName:		"dropdownValue",



	/** Callbacks */
	onSelect:	null,
	onChange:	null,
	onChanged:	null,


	/** Convenience method that returns the value of the currently selected HTML node. */
	currentValue:	function(){
		return (this.current && this.current[0]) ? this.current[0][this.valueName] : null;
	},



	/** Changes the StyledDropdown's currently selected item. */
	set:	function(input, byValue){
		var input, $this	=	this;


		/**	Select a node with a matching value. */
		if(byValue) input	=	this.items.filter(function(){
			return input == this[$this.valueName];
		});


		/** Select a node by its stored index. */
		else if(input === 0 || input === "0" || parseInt(input))
			input	=	$(this.items[input]);


		/** Actual node itself (DOM reference/jQuery instance) */
		else input	=	$(input).closest(this.items.selector);



		/** If onSelect explicitly returns FALSE, don't change anything. */
		if("function" === typeof this.onSelect && this.onSelect(input) === false) return;


		if(input !== this.current){

			/** Run the onChange callback and allow it to halt the operation by returning FALSE. */
			if("function" === typeof this.onChange && this.onChange.call(this, input, this.current) === false)
				return;


			/** Mark selected any <option> nodes with values matching the newly-selected item. */
			var disabled;
			if(input && input[0]) $("option", this.menu).each(function(){
				if(this.value == input[0][$this.valueName]){
					if(this.disabled)	disabled		=	true;
					else				this.selected	=	true;
				}

				else this.selected		=	false;
			});


			/** If one or more matching <option> elements are disabled, don't switch values. */
			if(disabled) return;


			/** Apply any de/selection classes to the styled nodes */
			this.items.removeClass(this.selectedClass).addClass(this.unselectedClass);
			input.addClass(this.selectedClass).removeClass(this.unselectedClass);
			this.current	=	input;


			if("function" === typeof this.onChanged)
				this.onChanged(this.current);
		}
	}
});


document.styledDropdowns	=	[];

$(document).ready(function(){
	$(".styled-dropdown").each(function(){
		document.styledDropdowns.push(new StyledDropdown(this));
	});
});