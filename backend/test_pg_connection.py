import psycopg2
from psycopg2 import sql


def check_db_connection():
    try:
        conn = psycopg2.connect(
            dbname="patent_db",
            user="patent_user",
            password="patent_password",
            host="db",
            port="5432"
        )
        conn.close()
        print("Database connection successful!")
        return True
    except psycopg2.OperationalError:
        print("Unable to connect to the database.")
        return False
    

def query_database(table_name):
    try:
        conn = psycopg2.connect(
            dbname="patent_db",
            user="patent_user",
            password="patent_password",
            host="db",
            port="5432"
        )
        cur = conn.cursor()
        
        # Use sql.Identifier to safely quote the table name
        query = sql.SQL("SELECT * FROM {}").format(sql.Identifier(table_name))
        cur.execute(query)
        
        rows = cur.fetchall()
        for row in rows:
            print(row)
        
        cur.close()
        conn.close()
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL", error)


if __name__ == "__main__":
    check_db_connection()
    table_name = "single_patent_searches"
    query_database(table_name)

    