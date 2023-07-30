import knex from 'knex';

export const up = async (knex) => {
	await knex.schema.createTable('IPAddress', function (table) {
		table.increments('id').primary();
		table.string('ipAddress').notNullable();
		table.timestamp('lastUpdated').notNullable().defaultTo(knex.fn.now());
	});

	await knex.schema.createTable('Record', function (table) {
		table.string('id').notNullable().primary();
		table.text('content').notNullable();
		table.string('name').notNullable();
		table.string('type').notNullable();
		table.datetime('modified_on').notNullable();
		table.string('zone_name').notNullable();
		table.string('zone_id').notNullable();
		table.integer('enabled').defaultTo(0);
		table.foreign('zone_id').references('Zones.zone_id').onDelete('CASCADE');
	});

	await knex.schema.createTable('Log', function (table) {
		table.increments('id').primary();
		table.string('action').notNullable();
		table.string('type').notNullable().defaultTo('INFO');
		table.text('message').notNullable();
		table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now());
		table.string('related_object');
		table.string('related_type');
	});

	await knex.schema.createTable('IpProviders', function (table) {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.string('url').notNullable();
		table.integer('active').notNullable().defaultTo(0);
	});

	await knex('IpProviders').insert([
		{ name: 'IPify', url: 'https://api.ipify.org?format=json', active: 1 },
		{ name: 'IP API', url: 'https://ipapi.co/json/', active: 1 },
		{ name: 'My-IP', url: 'https://api.my-ip.io/ip.json', active: 1 }
	]);

	await knex.schema.createTable('Zones', function (table) {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.string('zone_id').notNullable().unique();
	});

	await knex.schema.createTable('Settings', function (table) {
		table.increments('id').primary();
		table.string('name').notNullable().unique();
		table.text('value').notNullable();
		table.text('description');
	});

	await knex('Settings').insert([
		{
			name: 'ip_update_interval',
			value: '*/5 * * * *',
			description: 'Frequency in which the server requests your public IP from IP Providers'
		},
		{ name: 'debug', value: 'false', description: 'Enable debug mode for more verbose logging.' }
	]);

	await knex.schema.createTable('RecordLog', function (table) {
		table.increments('id');
		table.string('timestamp');
		table.string('action');
		table.string('result');
		table.string('message');
		table.string('old_ip');
		table.string('new_ip');
		table.string('record_id');
	});
};

export const down = async (knex) => {
	await knex.schema.dropTable('IPAddress');
	await knex.schema.dropTable('Record');
	await knex.schema.dropTable('Log');
	await knex.schema.dropTable('IpProviders');
	await knex.schema.dropTable('Zones');
	await knex.schema.dropTable('Settings');
	await knex.schema.dropTable('RecordLog');
};
