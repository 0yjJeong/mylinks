--
-- PostgreSQL database dump
--

-- Dumped from database version 13.9
-- Dumped by pg_dump version 14.6 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: mylinks
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO mylinks;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: mylinks
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_id_seq OWNER TO mylinks;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mylinks
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: mylinks
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO mylinks;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: mylinks
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_lock_index_seq OWNER TO mylinks;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mylinks
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: rows; Type: TABLE; Schema: public; Owner: mylinks
--

CREATE TABLE public.rows (
    id uuid NOT NULL,
    table_id uuid,
    url character varying(255),
    title character varying(255),
    image character varying(255),
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rows OWNER TO mylinks;

--
-- Name: table_to_tables; Type: TABLE; Schema: public; Owner: mylinks
--

CREATE TABLE public.table_to_tables (
    id uuid NOT NULL,
    source_id uuid,
    target_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.table_to_tables OWNER TO mylinks;

--
-- Name: tables; Type: TABLE; Schema: public; Owner: mylinks
--

CREATE TABLE public.tables (
    id uuid NOT NULL,
    title character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tables OWNER TO mylinks;

--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: mylinks
--

COPY public.knex_migrations (id, name, batch, migration_time) FROM stdin;
1	20230114132202.ts	1	2023-02-06 12:48:31.644+09
\.


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: mylinks
--

COPY public.knex_migrations_lock (index, is_locked) FROM stdin;
1	0
\.


--
-- Data for Name: rows; Type: TABLE DATA; Schema: public; Owner: mylinks
--

COPY public.rows (id, table_id, url, title, image, description, created_at) FROM stdin;
\.


--
-- Data for Name: table_to_tables; Type: TABLE DATA; Schema: public; Owner: mylinks
--

COPY public.table_to_tables (id, source_id, target_id, created_at) FROM stdin;
\.


--
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: mylinks
--

COPY public.tables (id, title, created_at) FROM stdin;
\.


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mylinks
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 1, true);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: public; Owner: mylinks
--

SELECT pg_catalog.setval('public.knex_migrations_lock_index_seq', 1, true);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: rows rows_pkey; Type: CONSTRAINT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.rows
    ADD CONSTRAINT rows_pkey PRIMARY KEY (id);


--
-- Name: table_to_tables table_to_tables_pkey; Type: CONSTRAINT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.table_to_tables
    ADD CONSTRAINT table_to_tables_pkey PRIMARY KEY (id);


--
-- Name: tables tables_pkey; Type: CONSTRAINT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
-- Name: rows rows_table_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.rows
    ADD CONSTRAINT rows_table_id_foreign FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE CASCADE;


--
-- Name: table_to_tables table_to_tables_source_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.table_to_tables
    ADD CONSTRAINT table_to_tables_source_id_foreign FOREIGN KEY (source_id) REFERENCES public.tables(id) ON DELETE CASCADE;


--
-- Name: table_to_tables table_to_tables_target_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: mylinks
--

ALTER TABLE ONLY public.table_to_tables
    ADD CONSTRAINT table_to_tables_target_id_foreign FOREIGN KEY (target_id) REFERENCES public.tables(id);


--
-- PostgreSQL database dump complete
--

