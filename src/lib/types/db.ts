export interface IPAddress {
	id: number;
	ipAddress: string;
	lastUpdated: string;
}

export interface Record {
	id: string;
	content: string;
	name: string;
	type: string;
	modified_on: string;
	zone_name: string;
	zone_id: string;
	enabled: number;
}

export interface Log {
	id: number;
	type: 'INFO' | 'ERROR' | 'DEBUG';
	action: string;
	message: string;
	timestamp: string;
	related_object: string;
	related_type: string;
}

export interface IpProviders {
	id: number;
	name: string;
	url: string;
	active: number;
}

export interface Zones {
	id: number;
	name: string;
	zone_id: string;
}

export interface Settings {
	id: number;
	name: string;
	value: string;
	description: string;
}

export interface LogFilter {
	id?: number;
	type?: 'INFO' | 'DEBUG' | 'ERROR';
	action?: string;
	message?: string;
	timestamp?: string;
	related_object?: string;
	related_type?: string;
}

export interface RecordLog {
	id: number;
	timestamp: string;
	action: string;
	result: string;
	message: string;
	old_ip?: string;
	new_ip?: string;
	record_id: string;
}
