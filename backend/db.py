import mysql.connector

def get_db():
    return mysql.connector.connect(
        host='localhost',
        user='root',  # <-- your MySQL username
        password='MySQL password',  # <-- your MySQL password
        database='dr_consultation'
    )
