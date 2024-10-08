var fields = ['speed', 'weight', 'acceleration', 'handling', 'drift', 'off_road', 'mini_turbo'];
var inputForFields = {};

var kartList;
var characterList;

function refresh() {
	var weights = {};
	$.each(fields, function(i,field) {
		weights[field] = inputForFields[field].val();
	});
	
	//sort 
	$.each([
		{sources:karts, srcList:kartList},
		{sources:characters, srcList:characterList}
	], function(_,info) {
		var sources = info.sources;
		var srcList = info.srcList;
		var scores = {}
		$.each(sources, function(i,src) {
			var score = 0;
			$.each(fields, function(i,field) {
				score += src[field] * weights[field];
			});
			scores[i] = score;
		});
		var indexes = [];
		for (var i = 0; i < sources.length; ++i) {
			indexes.push(i);
		}
		indexes.sort(function(a,b) {
			return scores[b] - scores[a];
		});
		srcList.empty();
		var table = $('<table>', {
			border : 1,
			cellspacing : 0,
			cellpadding : 2
		}).appendTo(srcList);
		var headerTr = $('<tr>').appendTo(table);
		var header = function(text) {
			return $('<th>', {
				text : text
			}).appendTo(headerTr);
		};
		header('score');
		header('name');
		header('size');
		if (sources == karts) {
			header('type');
			header('in_vs_out'.substr(0,2));
		}
		$.each(fields, function(j,field) {
			header(field.substr(0,2));
		});
		$.each(indexes, function(_,i) {
			var src = sources[i];
			var tr = $('<tr>').appendTo(table);
			$('<td>', {text:scores[i]}).appendTo(tr);
			$('<td>', {text:src.name}).appendTo(tr);
			$('<td>', {text:src['size']}).appendTo(tr);
			if (sources == karts) {
				$('<td>', {text:src.type}).appendTo(tr);
				$('<td>', {text:src.in_vs_out}).appendTo(tr);
			}
			$.each(fields, function(j,field) {
				$('<td>', {text:src[field]}).appendTo(tr);
			});
		});
	});
}

$(document).ready(function() {
	var inputDiv = $('<div>', {
		css : {
			display : 'table-cell'
		}
	}).appendTo(document.body);

	$('<div>', {text:'Weights:', css:{'font-weight':'bold'}}).appendTo(inputDiv);
	var table = $('<table>').appendTo(inputDiv);
	$.each(fields, function(i,field) {
		var tr = $('<tr>').appendTo(table);
		$('<td>', {text:field.substr(0,2)+' = '+field}).appendTo(tr);
		var inputTd = $('<td>').appendTo(tr);
		inputForFields[field] = $('<input>', {
			value : 1,
			keyup : refresh
		}).appendTo(inputTd);
	});

	characterList = $('<div>', {
		css : {
			'padding-left' : '50px',
			display : 'table-cell'
		}
	}).appendTo(document.body);

	kartList = $('<div>', {
		css : {
			'padding-left' : '50px',
			display : 'table-cell'
		}
	}).appendTo(document.body);
	
	refresh();
});

