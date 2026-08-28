
import sqlite3
import unittest
import os

DB = '/mnt/data/members.db'

class TestLapaLaPholoma(unittest.TestCase):
    def setUp(self):
        self.conn = sqlite3.connect(DB)
        self.cur = self.conn.cursor()
    
    def tearDown(self):
        self.conn.close()
    
    def test_member_count(self):
        self.cur.execute("SELECT COUNT(*) FROM members")
        count = self.cur.fetchone()[0]
        self.assertGreaterEqual(count, 10, "Should have at least 10 members (Pholoma family)")
    
    def test_root_exists(self):
        self.cur.execute("SELECT * FROM members WHERE first_name='Pholoma'")
        self.assertIsNotNone(self.cur.fetchone(), "Pholoma must exist")
        self.cur.execute("SELECT * FROM members WHERE first_name LIKE '%Mahoai%'")
        self.assertIsNotNone(self.cur.fetchone(), "Ngwana Mahoai must exist")
    
    def test_seven_children(self):
        self.cur.execute("SELECT COUNT(*) FROM relationships WHERE person_id=1")
        count_father = self.cur.fetchone()[0]
        self.assertEqual(count_father, 7, "Pholoma should have 7 children")
        self.cur.execute("SELECT COUNT(*) FROM relationships WHERE person_id=2")
        count_mother = self.cur.fetchone()[0]
        self.assertEqual(count_mother, 7, "Ngwana Mahoai should have 7 children")
    
    def test_aka_handling(self):
        self.cur.execute("SELECT aka FROM members WHERE first_name LIKE '%Makgabo%'")
        row = self.cur.fetchone()
        self.assertEqual(row[0], "Raesetja", "Makgabo aka should be Raesetja")
        self.cur.execute("SELECT aka FROM members WHERE first_name='Leka'")
        row = self.cur.fetchone()
        self.assertEqual(row[0], "Lesiba", "Leka aka should be Lesiba")
    
    def test_note_handling(self):
        self.cur.execute("SELECT note FROM members WHERE first_name='Tshwene'")
        self.assertEqual(self.cur.fetchone()[0], "wa go timela")
        self.cur.execute("SELECT note FROM members WHERE first_name LIKE '%Mmanare%'")
        self.assertIn("Thabitha", self.cur.fetchone()[0])
    
    def test_thabitha_child(self):
        self.cur.execute("SELECT related_to_id FROM relationships WHERE person_id=4")
        child_id = self.cur.fetchone()[0]
        self.cur.execute("SELECT first_name FROM members WHERE id=?", (child_id,))
        self.assertEqual(self.cur.fetchone()[0], "Thabitha")
    
    def test_generation(self):
        self.cur.execute("SELECT generation FROM members WHERE first_name='Pholoma'")
        self.assertEqual(self.cur.fetchone()[0], 1)
        self.cur.execute("SELECT generation FROM members WHERE first_name LIKE '%Makgabo%'")
        self.assertEqual(self.cur.fetchone()[0], 2)
        self.cur.execute("SELECT generation FROM members WHERE first_name='Thabitha'")
        self.assertEqual(self.cur.fetchone()[0], 3)
    
    def test_no_orphans(self):
        self.cur.execute("SELECT COUNT(*) FROM relationships r LEFT JOIN members m ON r.related_to_id=m.id WHERE m.id IS NULL")
        self.assertEqual(self.cur.fetchone()[0], 0)
    
    def test_sql_injection_blocked(self):
        malicious = "Robert'); DROP TABLE members; --"
        self.cur.execute("SELECT * FROM members WHERE first_name=?", (malicious,))
        self.cur.execute("SELECT COUNT(*) FROM members")
        self.assertGreaterEqual(self.cur.fetchone()[0], 10)
    
    def test_gender_constraint(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.cur.execute("INSERT INTO members (first_name, last_name, gender) VALUES ('Bad','Test','X')")
            self.conn.commit()

if __name__ == '__main__':
    unittest.main(verbosity=2)
