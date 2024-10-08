const fields = ['speed', 'weight', 'acceleration', 'handling', 'drift', 'off_road', 'mini_turbo'];
const inputForFields = {};

let kartList;
let characterList;

const refresh = () => {
	let weights = {};
	fields.forEach(field => {
		weights[field] = inputForFields[field].val();
	});
	
	//sort 
	[
		{sources:karts, srcList:kartList},
		{sources:characters, srcList:characterList}
	].forEach(info => {
		const sources = info.sources;
		const srcList = info.srcList;
		const scores = {}
		sources.forEach((src,i) => {
			let score = 0;
			fields.forEach(field => {
				score += src[field] * weights[field];
			});
			scores[i] = score;
		});
		const indexes = [];
		for (let i = 0; i < sources.length; ++i) {
			indexes.push(i);
		}
		indexes.sort((a,b) => scores[b] - scores[a]);
		srcList.empty();
		const table = $('<table>', {
			border : 1,
			cellspacing : 0,
			cellpadding : 2
		}).appendTo(srcList);
		const headerTr = $('<tr>').appendTo(table);
		const header = text => 
			$('<th>', {
				text : text,
			}).appendTo(headerTr);
		header('score');
		header('name');
		header('size');
		if (sources == karts) {
			header('type');
			header('in_vs_out'.substr(0,2));
		}
		fields.forEach(field => {
			header(field.substr(0,2));
		});
		indexes.forEach(i => {
			const src = sources[i];
			const tr = $('<tr>').appendTo(table);
			$('<td>', {text:scores[i]}).appendTo(tr);
			$('<td>', {text:src.name}).appendTo(tr);
			$('<td>', {text:src['size']}).appendTo(tr);
			if (sources == karts) {
				$('<td>', {text:src.type}).appendTo(tr);
				$('<td>', {text:src.in_vs_out}).appendTo(tr);
			}
			fields.forEach(field => {
				$('<td>', {text:src[field]}).appendTo(tr);
			});
		});
	});
}

$(document).ready(() => {
	const inputDiv = $('<div>', {
		css : {
			display : 'table-cell'
		}
	}).appendTo(document.body);

	$('<div>', {text:'Weights:', css:{'font-weight':'bold'}}).appendTo(inputDiv);
	const table = $('<table>').appendTo(inputDiv);
	fields.forEach(field => {
		const tr = $('<tr>').appendTo(table);
		$('<td>', {text:field.substr(0,2)+' = '+field}).appendTo(tr);
		const inputTd = $('<td>').appendTo(tr);
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

