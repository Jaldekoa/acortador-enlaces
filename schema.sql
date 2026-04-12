CREATE TABLE "main"."table_links"(
  "id" INTEGER NOT NULL,
  "short_url" TEXT NOT NULL,
  "long_url" TEXT NOT NULL,
  "hits" INTEGER,
  "active" INTEGER,
  PRIMARY KEY ("id")
)
