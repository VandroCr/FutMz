"""Adicionar tabela teams ao banco de dados"""
from database import engine, Base
from models import Team

def add_teams_table():
    """Cria a tabela teams se não existir"""
    Base.metadata.create_all(bind=engine, tables=[Team.__table__])
    print("Tabela 'teams' criada/verificada com sucesso!")

if __name__ == "__main__":
    add_teams_table()

