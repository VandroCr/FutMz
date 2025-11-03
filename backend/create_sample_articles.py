"""
Script para criar artigos de exemplo
"""
from database import SessionLocal
from models import User, Article

def create_sample_articles():
    """Criar artigos de exemplo"""
    db = SessionLocal()
    
    try:
        # Buscar o primeiro usuário admin
        admin = db.query(User).filter(User.is_admin == True).first()
        
        if not admin:
            print("❌ Erro: Nenhum administrador encontrado!")
            print("   Execute primeiro: python create_admin.py")
            return False
        
        # Artigos de exemplo
        sample_articles = [
            {
                "title": "Liga Moçambicana 2025: Previsões e Expectativas",
                "slug": "liga-mocambicana-2025-previsoes",
                "content": "A Liga Moçambicana de 2025 promete ser emocionante com várias equipes fortalecidas. Analisamos as principais novidades e previsões para a temporada.",
                "excerpt": "Análise completa da próxima temporada do futebol moçambicano.",
                "category": "Liga Moçambicana",
                "tags": "Liga Moçambicana, Futebol Moçambicano, 2025",
                "published": True,
                "featured": True,
                "author_id": admin.id
            },
            {
                "title": "Seleção Nacional: Convocados para Eliminatórias",
                "slug": "selecao-nacional-convocados-eliminatorias",
                "content": "O técnico da seleção moçambicana anunciou a lista de convocados para as próximas partidas das eliminatórias. Veja quem foi chamado e as expectativas.",
                "excerpt": "Confira a lista de convocados para os próximos jogos.",
                "category": "Seleção Nacional",
                "tags": "Seleção Moçambicana, Eliminatórias, Futebol",
                "published": True,
                "featured": True,
                "author_id": admin.id
            },
            {
                "title": "Futebol Europeu: Champions League em Foco",
                "slug": "futebol-europeu-champions-league",
                "content": "As maiores competições europeias estão aquecidas. Análise dos principais times e jogadores em destaque.",
                "excerpt": "Tudo sobre as principais competições europeias.",
                "category": "Futebol Europeu",
                "tags": "Champions League, Europa, Futebol Internacional",
                "published": True,
                "featured": False,
                "author_id": admin.id
            },
            {
                "title": "Jovens Talentos Moçambicanos no Exterior",
                "slug": "jovens-talentos-mocambicanos-exterior",
                "content": "Conheça os jovens jogadores moçambicanos que estão brilhando em ligas internacionais.",
                "excerpt": "Descubra os talentos moçambicanos em campo internacional.",
                "category": "Internacional",
                "tags": "Jovens Talentos, Moçambique, Futebol Internacional",
                "published": True,
                "featured": False,
                "author_id": admin.id
            },
            {
                "title": "Estratégia e Táticas: Formações Modernas",
                "slug": "estrategia-taticas-formacoes-modernas",
                "content": "Análise tática das formações mais usadas no futebol moderno e como elas influenciam o jogo.",
                "excerpt": "Entenda as principais formações e táticas do futebol atual.",
                "category": "Análise Tática",
                "tags": "Táticas, Formações, Futebol, Análise",
                "published": True,
                "featured": False,
                "author_id": admin.id
            }
        ]
        
        # Criar artigos
        created = 0
        for article_data in sample_articles:
            # Verificar se já existe
            existing = db.query(Article).filter(Article.slug == article_data["slug"]).first()
            if not existing:
                article = Article(**article_data)
                db.add(article)
                created += 1
        
        db.commit()
        
        print(f"✅ {created} artigos criados com sucesso!")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar artigos: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Criar Artigos de Exemplo - FutMz")
    print("=" * 50)
    create_sample_articles()



