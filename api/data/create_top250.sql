-- Table: public.top250

-- DROP TABLE public.top250;

CREATE TABLE public.top250
(
    id integer NOT NULL,
    kp_id integer NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    rating real NOT NULL,
    genre character varying COLLATE pg_catalog."default" NOT NULL,
    year integer NOT NULL,
    CONSTRAINT top250_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.top250
    OWNER to postgres;