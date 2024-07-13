-- Create table
CREATE TABLE IF NOT EXISTS public."PRODUCT" (
	"productCode" varchar NOT NULL,
	"location" varchar NOT NULL,
	price float8 NOT NULL,
	PRIMARY KEY ("productCode")
);

-- Insert demo data
INSERT INTO public."PRODUCT" ("productCode", "location", price) VALUES ('1000', 'KL', 500.0);
INSERT INTO public."PRODUCT" ("productCode", "location", price) VALUES ('1001', 'KL', 350.0);
INSERT INTO public."PRODUCT" ("productCode", "location", price) VALUES ('1002', 'KL', 200.0);
INSERT INTO public."PRODUCT" ("productCode", "location", price) VALUES ('1003', 'KL', 150.0);
