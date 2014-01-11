/*
	Model Controller

	Assign null to 'id' get all models
*/
function ModelController(id, urlBase){
	var self = this;

	self.id = id;
	self.urlBase = urlBase;

	self.api = {
		find: '/find/',
		create: '/create',
		destroy: '/destroy/',
	};

	self.data = {};

	// Loads data
	self.load = function(cb){
		var self = this;
		$.ajax({
			url: self.urlBase + self.api.find + (self.id || '')
		}).done(done);

		function done(data){
			self.data = data;

			if(cb) cb(data); 
		}
	}

	// Create a new Model with the given data
	self.create = function(data, cb){
		data = data || {};

		$.ajax({
			url: self.urlBase + self.api.create,
			type: 'POST',
			data: data,
		}).done(done);

		function done(data){
			if(cb) cb(data);
		}
	}

	// Destroy this group
	self.destroy = function(cb){
		// return cb();
		$.ajax({
			url: self.urlBase + self.api.destroy + self.id,
			type: 'DELETE',
		}).done(done);

		function done(data){
			if(cb) cb(data);
		}
	}
}


/*
	Creates a table with the given headers, content and jQuery root object
*/
function createTable(headers, content, root){
	// Try recycling table if set
	var $table = (root ? root : $('<table>'));

	// Make it visible and remove id
	$table.removeClass('hide');
	$table.removeAttr('id');

	// Creates thead
	$thead = $('<thead>');

	// Add Headers
	var headersCount = 0;
	$tr = $('<tr>');
	$thead.append($tr);

	for(var k in headers){
		$tr.append($('<th>').text(headers[k]));
		headersCount++;
	}

	// Creates tbody
	$tbody = $('<tbody>');
	
	// Go trough all contents and adds to table
	for(var c in content){
		var rowData = content[c];
		// console.log(rowData);
		var $row = $('<tr>');

		// Go through headers and append to table
		for(var k in headers){
			var value = Object.byString(rowData,k);
			$row.append($('<td>').text(value));
		}

		$tbody.append($row);
	}

	// Show 'nothing on table' If there is no data
	if(content.length <= 0){
		var $row = $('<tr>');
		$row.append($('<td>').addClass('text-center').attr('colspan', ''+headersCount).text('No data in table'));
		$tbody.append($row);
	}

	$table.empty();
	$table.append($thead);
	$table.append($tbody);

	return $table;
}