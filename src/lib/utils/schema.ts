export const schema = `
CREATE TABLE "IPAddress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ipAddress" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Record" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "modified_on" DATETIME NOT NULL,
    "zone_name" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "enabled" INTEGER DEFAULT (0),
    FOREIGN KEY ("zone_id") REFERENCES "Zones"("zone_id") ON DELETE CASCADE
);

CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "action" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT "INFO",
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "related_object" TEXT,
    "related_type" TEXT
);

CREATE TABLE "IpProviders" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT (0)
);

INSERT INTO IpProviders (name,url,active) VALUES
     ('IPify','https://api.ipify.org?format=json',1),
     ('IP API','https://ipapi.co/json/',1),
     ('My-IP','https://api.my-ip.io/ip.json',1);

CREATE TABLE "Zones" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    CONSTRAINT "Zones_UN" UNIQUE ("zone_id")
);

CREATE TABLE "Settings" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "Settings_UN" UNIQUE ("name")
);

INSERT INTO Settings (name,value,description) VALUES
     ('ip_update_interval','*/5 * * * *','Frequency in which the server requests your public IP from IP Providers'),
     ('debug','false','Enable debug mode for more verbose logging.');
`;
