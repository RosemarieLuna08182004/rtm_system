# Database

MySQL 8 (Aiven in production).

## Schema

`Dump20241016/` is the authoritative schema, one file per table. The old
single-file `rtmdb.sql` was out of date (no `Illustration`, `chapter.Coins` or
`user.AccountType`) and has been removed.

The dumps for `user`, `userline` and `userterms` are **schema only**. They
must never hold real user data. Content tables (chapter, term, termline,
category, illustration) still include their learning content.

## Migrations

`migrations/` holds changes made after the dump, named `YYYY-MM-DD_NN_name.sql`.
Apply them in name order, by hand, and always take a backup first.

| File | What it does | Changes data? |
|---|---|---|
| `2026-10-19_01_remove_google_sign_in.sql` | Lists Google-created accounts, clears stored Google tokens | Yes |
| `2026-10-20_01_integrity_checks.sql` | Read-only report of problems that would block the constraints | No |
| `2026-10-20_02_integrity_fixes.sql` | Normalises emails, removes duplicate bookmark/unlock rows, names untitled terms | Yes |
| `2026-10-20_03_integrity_constraints.sql` | Adds unique keys, the term → chapter foreign key, `term.Term NOT NULL` | Schema |

### Applying 2026-10-20 (integrity)

1. Back up the database (Aiven console: create a backup, or `mysqldump`).
2. Run `01_integrity_checks.sql`. Each query should return **no rows**, except the
   ones that `02` fixes automatically (marked in the file).
3. If the **duplicate emails** or **orphan terms** checks return rows, fix those
   by hand first. They need a decision (which account to keep, which chapter a
   term belongs to), so `02` does not touch them.
4. Run `02_integrity_fixes.sql`, then `01` again. Every check should now be empty.
5. Run `03_integrity_constraints.sql`.
