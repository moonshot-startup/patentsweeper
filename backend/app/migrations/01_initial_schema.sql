CREATE TABLE IF NOT EXISTS single_patent_searches (
    "id" SERIAL PRIMARY KEY,
    "query" VARCHAR(255),
    "inventionTitle" VARCHAR(255),
    "inventionSubjectMatterCategory" VARCHAR(255),
    "patentApplicationNumber" VARCHAR(255),
    "filingDate" VARCHAR(255),
    "publicationDate" VARCHAR(255),
    "publicationDocumentIdentifier" VARCHAR(255),
    "filelocationURI" VARCHAR(5000),
    "abstractText" VARCHAR(64000),
    "claimText" VARCHAR(64000),
    "descriptionText" VARCHAR(64000)
);
CREATE INDEX IF NOT EXISTS idx_single_patent_searches_query ON single_patent_searches ("query");