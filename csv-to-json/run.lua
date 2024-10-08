#! /usr/bin/env lua -lluarocks.require
local csv = require 'csv'
local json = require 'dkjson'
local table = require 'ext.table'
local file = require 'ext.file'
local string = require 'ext.string'

local karts = csv.file'karts.csv'
karts:setColumnNames(karts.rows[1])

local characters = csv.file'characters.csv'
characters:setColumnNames(characters.rows[1])

-- and output again to JSON

local characterFields = table{
	'Name',
	'Class',	-- light, medium, heavy
	'Speed', 	-- top speed
	'Weight', 
	'Acceleration',
	'Handling', 	-- cornering
	'Drift',
	'Off-Road',
	'Mini-Turbo',
}
local kartFields = table(characterFields):append{
	'Type', 	-- Kart vs Bike
	'In-vs-Out',	-- cornering style
}

for _,info in ipairs{
	{src=karts, fields=kartFields, dstfile='karts.json'},
	{src=characters, fields=characterFields, dstfile='characters.json'},
} do
	local outputs = {}
	local src = info.src
	for i=2,#src.rows do
		local output = {}
		for _,field in ipairs(info.fields) do
			output[field:lower():gsub('%-','_')] = assert(string.trim(src.rows[i][field]), "failed to find field "..field.." when writing file "..info.dstfile)
		end
		table.insert(outputs, output)
	end
	file[info.dstfile] = json.encode(outputs, {indent=true})
end

