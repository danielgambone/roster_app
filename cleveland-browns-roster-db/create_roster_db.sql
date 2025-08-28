CREATE TABLE roster (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    number INTEGER,
    height TEXT,
    weight INTEGER,
    college TEXT
);

.mode csv
.import roster.csv roster