/*
user
 */
CREATE TABLE IF NOT EXISTS `ownership` (
  `name` VARCHAR(50) PRIMARY KEY NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL DEFAULT '',
  `branch` VARCHAR(25) DEFAULT '',
  `department` VARCHAR(25) DEFAULT '',
  `last_login` DATETIME NOT NULL,
  `created` DATETIME NOT NULL,
  `updated` DATETIME NOT NULL,
  `image` VARCHAR(50) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS `forgot_tokens` (
  `owner_name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires` DATETIME NOT NULL,
  `created` DATETIME NOT NULL
);

/*
jsbin
 */
CREATE TABLE IF NOT EXISTS `jsbin_owners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `revision` INTEGER DEFAULT '1',
  `last_updated` DATETIME DEFAULT NULL,
  `summary` VARCHAR(255) NOT NULL DEFAULT '',
  `html` INTEGER DEFAULT '0',
  `css` INTEGER DEFAULT '0',
  `javascript` INTEGER DEFAULT '0',
  `archive` INTEGER DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS `jsbin_sandbox` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `html` TEXT NOT NULL DEFAULT "",
  `css` TEXT NOT NULL DEFAULT "",
  `javascript` TEXT NOT NULL  DEFAULT "",
  `created` DATETIME DEFAULT NULL,
  `last_viewed` DATETIME DEFAULT NULL,
  `url` VARCHAR(255) DEFAULT NULL,
  `active` VARCHAR(1) DEFAULT 'y',
  `reported` DATETIME DEFAULT NULL,
  `streaming` VARCHAR(1) DEFAULT 'n',
  `streaming_key` VARCHAR(32),
  `streaming_read_key` VARCHAR(32),
  `active_tab` VARCHAR(10),
  `active_cursor` INTEGER,
  `revision` INTEGER DEFAULT '1',
  `settings` TEXT NOT NULL DEFAULT ''
);


/* mocky */
CREATE TABLE IF NOT EXISTS `mocky_owners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `revision` INTEGER DEFAULT '1',
  `last_updated` DATETIME DEFAULT NULL,
  `summary` VARCHAR(255) NOT NULL DEFAULT '',
  `param` VARCHAR(255) DEFAULT '',
  `mockdata` INTEGER DEFAULT '0',
  `realdata` INTEGER DEFAULT '0',
  `archive` INTEGER DEFAULT '0',
  `templates` VARCHAR(255) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS `mocky_sandbox` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `mockdata` TEXT NOT NULL DEFAULT "",
  `realdata` TEXT NOT NULL DEFAULT "",
  `created` DATETIME DEFAULT NULL,
  `last_viewed` DATETIME DEFAULT NULL,
  `url` VARCHAR(255) DEFAULT NULL,
  `active` VARCHAR(1) DEFAULT 'y',
  `reported` DATETIME DEFAULT NULL,
  `streaming` VARCHAR(1) DEFAULT 'n',
  `streaming_key` VARCHAR(32),
  `streaming_read_key` VARCHAR(32),
  `active_tab` VARCHAR(10),
  `active_cursor` INTEGER,
  `revision` INTEGER DEFAULT '1',
  `settings` TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS `mocky_template` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `param` VARCHAR(255) DEFAULT '',
  `content` TEXT DEFAULT '',
  `type` VARCHAR(25) DEFAULT NULL
);

/*
hao321
 */
CREATE TABLE IF NOT EXISTS `hao321_owners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `summary` VARCHAR(25) NOT NULL,
  `url` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100) DEFAULT '',
  `member` VARCHAR(255) DEFAULT '',
  `expire` INTEGER DEFAULT '0',
  `admin` VARCHAR(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS `hao321_notice` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `assign` VARCHAR(25) NOT NULL,
  `hao321` INTEGER NOT NULL,
  `expire` INTEGER DEFAULT '0',
  `last_updated` DATETIME DEFAULT NULL
);

/*
demand
 */
CREATE TABLE IF NOT EXISTS `demand_owners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `summary` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT '',
  `url` VARCHAR(100) NOT NULL,
  `prd` VARCHAR(100) NOT NULL DEFAULT '',
  `kickoff` INTEGER DEFAULT '1',
  `release` INTEGER DEFAULT '0',
  `last_updated` DATETIME DEFAULT NULL,
  `expect` DATETIME DEFAULT NULL,
  `type` INTEGER NOT NULL,
  `member` VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS `demand_type` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `summary` VARCHAR(25) NOT NULL,
  `name` VA RCHAR(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS `demand_stage` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `demand` INTEGER NOT NULL,
  `summary` VARCHAR(100) NOT NULL,
  `delay` INTEGER DEFAULT '0',
  `reason` TEXT DEFAULT '',
  `prev` INTEGER NOT NULL,
  `next` INTEGER NOT NULL,
  `last_updated` DATETIME DEFAULT NULL,
  `assign` VARCHAR(255) NOT NULL DEFAULT '',
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `finish` INTEGER DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS `demand_discuss`(
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `stage` INTEGER DEFAULT NULL,
  `name` VARCHAR(25) NOT NULL,
  `content` TEXT DEFAULT '',
  `assign` VARCHAR(255) NOT NULL,
  `last_updated` DATETIME DEFAULT NULL
);

/*
issue
 */
CREATE TABLE IF NOT EXISTS `issue_owners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `summary` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `demand` INTEGER DEFAULT NULL,
  `description` TEXT DEFAULT '',
  `images` TEXT DEFAULT '',
  `assign` VARCHAR(255) NOT NULL,
  `cc` VARCHAR(255) DEFAULT NULL,
  `level` INTEGER DEFAULT '1',
  `operate` VARCHAR(255) DEFAULT '',
  `link` VARCHAR(255) NOT NULL,
  `last_updated` DATETIME DEFAULT NULL,
  `settings` TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS `issue_remark` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `issue` INTEGER NOT NULL
);

/*
report
 */
CREATE TABLE IF NOT EXISTS `report_owners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `revision` INTEGER DEFAULT '1',
  `summary` VARCHAR(255) NOT NULL DEFAULT '',
  `demand_stage` INTEGER DEFAULT '0',
  `demand` INTEGER DEFAULT '0',
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `last_updated` DATETIME DEFAULT NULL,
  `finish` INTEGER DEFAULT '0',
  `delay` INTEGER DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS `report_sandbox` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `created` DATETIME DEFAULT NULL,
  `last_viewed` DATETIME DEFAULT NULL,
  `url` VARCHAR(255) DEFAULT NULL,
  `streaming` VARCHAR(1) DEFAULT 'n',
  `streaming_key` VARCHAR(32),
  `streaming_read_key` VARCHAR(32),
  `revision` INTEGER DEFAULT '1',
  `demand_stage` VARCHAR(50) DEFAULT '',
  `demand` VARCHAR(50) DEFAULT ''
);


CREATE INDEX IF NOT EXISTS "sandbox_viewed" ON "jsbin_sandbox" (`last_viewed`);
CREATE INDEX IF NOT EXISTS "sandbox_url" ON "jsbin_sandbox" (`url`);
CREATE INDEX IF NOT EXISTS "sandbox_streaming_key" ON "jsbin_sandbox" (`streaming_key`);
CREATE INDEX IF NOT EXISTS "sandbox_spam" ON "jsbin_sandbox" (`created`,`last_viewed`);
CREATE INDEX IF NOT EXISTS "sandbox_revision" ON "jsbin_sandbox" (`url`,`revision`);
CREATE INDEX IF NOT EXISTS "ownership_name_key" ON "ownership" (`name`,`key`);
CREATE INDEX IF NOT EXISTS "owners_name_url" ON "jsbin_owners" (`name`,`url`,`revision`);
CREATE INDEX IF NOT EXISTS "index_owners_last_updated" ON "jsbin_owners" (`name`, `last_updated`);
CREATE INDEX IF NOT EXISTS "index_expires" ON "forgot_tokens" (`expires`);
CREATE INDEX IF NOT EXISTS "index_token_expires" ON "forgot_tokens" (`token`,`created`,`expires`);
