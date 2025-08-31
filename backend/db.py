import mysql.connector

def get_db():
    import os
    return mysql.connector.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASSWORD', '09022161Mg@..'),
        database=os.environ.get('DB_NAME', 'dr_consultation')
    )
