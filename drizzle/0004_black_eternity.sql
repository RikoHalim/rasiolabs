ALTER TABLE `orders` ADD `domain_included` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `domain_fee` integer DEFAULT 0;