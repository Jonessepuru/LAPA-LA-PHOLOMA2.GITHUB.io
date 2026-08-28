LAPA LA PHOLOMA - FULL WEBSITE PACKAGE
=====================================

Contents:
- members.db : Real SQLite database with Pholoma family (10 members, 15 relationships)
- schema.sql : Database schema
- README.txt : This file

Family:
- Root: Pholoma (Father) & Ngwana Mahoai (Mother)
- Children (7):
  1. Makgabo Sekutu aka Raesetja
  2. Mmanare Chokoe bommago Thabitha
  3. Leka / Lesiba (L e tee)
  4. Tshwene wa go timela
  5. Mmakomana wa ga Pula
  6. Raesibe
  7. Mmatšhwene wa Chokoe Non Parel
- Grandchild: Thabitha (child of Mmanare)

Usage:
- Open members.db with DB Browser for SQLite or sqlite3
- Use in Node.js / PHP: SELECT * FROM members; SELECT * FROM relationships;
- Frontend expects /api/tree endpoint returning JSON hierarchy

SQLite Example:
SELECT m.first_name, m.last_name, m.aka, r.type FROM members m JOIN relationships r ON m.id = r.related_to_id WHERE r.person_id = 1;

Zip includes website HTML file separately.
