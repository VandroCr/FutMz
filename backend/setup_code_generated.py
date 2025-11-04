# CÓDIGO GERADO PARA /api/setup
# Copie este código e cole no lugar do código atual em backend/main.py
# Substitua a seção que cria artigos (depois de criar o admin)

        # ===== CRIAR USUÁRIOS DO BANCO LOCAL =====
        # Mapeamento de IDs antigos para novos
        user_id_map = {}

        # Usuário: admin (Admin)
        existing_user_1 = db.query(User).filter(User.username == "admin").first()
        if not existing_user_1:
            user_1 = User(
                username="admin",
                email="admin@futmz.com",
                hashed_password="240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
                full_name="Administrador",
                is_admin=True
            )
            db.add(user_1)
            db.commit()
            db.refresh(user_1)
            user_id_map[1] = user_1.id
            print(f"✅ Usuário criado: admin")
        else:
            user_id_map[1] = existing_user_1.id
            print(f"ℹ️  Usuário já existe: admin")

        # Usuário: Vandro (Usuário)
        existing_user_2 = db.query(User).filter(User.username == "Vandro").first()
        if not existing_user_2:
            user_2 = User(
                username="Vandro",
                email="vandro@futmz.com",
                hashed_password="9bf0c4c28b627918c40abff765852e881bfb254b3a979ff4c259c20106948ac4",
                full_name="Vandro Correia",
                is_admin=False
            )
            db.add(user_2)
            db.commit()
            db.refresh(user_2)
            user_id_map[2] = user_2.id
            print(f"✅ Usuário criado: Vandro")
        else:
            user_id_map[2] = existing_user_2.id
            print(f"ℹ️  Usuário já existe: Vandro")

        # Usuário: Mauro (Usuário)
        existing_user_3 = db.query(User).filter(User.username == "Mauro").first()
        if not existing_user_3:
            user_3 = User(
                username="Mauro",
                email="zibanejr@gmail.com",
                hashed_password="0a62e652a69189b4eef456f1559bd6cfef5bad0de83270a498bca6a608c587e0",
                full_name="Mauro Bernardo",
                is_admin=False
            )
            db.add(user_3)
            db.commit()
            db.refresh(user_3)
            user_id_map[3] = user_3.id
            print(f"✅ Usuário criado: Mauro")
        else:
            user_id_map[3] = existing_user_3.id
            print(f"ℹ️  Usuário já existe: Mauro")

        # Usuário: Svetlana (Usuário)
        existing_user_4 = db.query(User).filter(User.username == "Svetlana").first()
        if not existing_user_4:
            user_4 = User(
                username="Svetlana",
                email="Svetlanabuque12@gmail.com",
                hashed_password="8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
                full_name="Svetlana Augusta Buque",
                is_admin=False
            )
            db.add(user_4)
            db.commit()
            db.refresh(user_4)
            user_id_map[4] = user_4.id
            print(f"✅ Usuário criado: Svetlana")
        else:
            user_id_map[4] = existing_user_4.id
            print(f"ℹ️  Usuário já existe: Svetlana")

        # Usuário: CT (Usuário)
        existing_user_5 = db.query(User).filter(User.username == "CT").first()
        if not existing_user_5:
            user_5 = User(
                username="CT",
                email="CT@gmail.com",
                hashed_password="5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
                full_name="Clinton Tomo",
                is_admin=False
            )
            db.add(user_5)
            db.commit()
            db.refresh(user_5)
            user_id_map[5] = user_5.id
            print(f"✅ Usuário criado: CT")
        else:
            user_id_map[5] = existing_user_5.id
            print(f"ℹ️  Usuário já existe: CT")

        # Usar admin existente ou criar um novo
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = db.query(User).filter(User.is_admin == True).first()
        if not admin:
            # Criar admin padrão se não existir
            admin = User(
                username="admin",
                email="admin@futmz.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Administrador",
                is_admin=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # ===== CRIAR ARTIGOS DO BANCO LOCAL =====
        sample_articles = [
            {
                "title": "Ferroviário de Lichinga ",
                "slug": "liga-mocambicana-2025-previsoes",
                "excerpt": "Surpreendendo a nova temporada. ",
                "content": "Ferroviário de Lichinga tem mostrando bom desempenho nessa nova temporada.",
                "category": "Nacional",
                "image_url": "https://futmz.onrender.com/uploads/0a710882-1291-44af-aed4-70457ad8a086.jpg",
                "published": True,
                "featured": False,
                "tags": "Liga Moçambicana, Futebol Moçambicano, 2025",
                "author_id": user_id_map.get(1, admin.id)
            },
            {
                "title": "Seleção Nacional: Convocados para Eliminatórias",
                "slug": "selecao-nacional-convocados-eliminatorias",
                "excerpt": "Confira a lista de convocados para os próximos jogos.",
                "content": "O técnico da seleção moçambicana anunciou a lista de convocados para as próximas partidas das eliminatórias. Veja quem foi chamado e as expectativas.",
                "category": "Nacional",
                "image_url": "https://futmz.onrender.com/uploads/1d885e6c-98f4-4e99-8b56-aee2476292b7.jpg",
                "published": True,
                "featured": True,
                "tags": "Seleção Moçambicana, Eliminatórias, Futebol",
                "author_id": user_id_map.get(1, admin.id)
            },
            {
                "title": "Jovens Talentos Moçambicanos no Exterior",
                "slug": "jovens-talentos-mocambicanos-exterior",
                "excerpt": "Descubra os talentos moçambicanos em campo internacional.",
                "content": "Conheça os jovens jogadores moçambicanos que estão brilhando em ligas internacionais.",
                "category": "Internacional",
                "image_url": "https://futmz.onrender.com/uploads/d9179c96-640c-4752-b4d9-6f1339bdc9d3.jpg",
                "published": True,
                "featured": False,
                "tags": "Jovens Talentos, Moçambique, Futebol Internacional",
                "author_id": user_id_map.get(1, admin.id)
            },
            {
                "title": "Convocatória Mambas",
                "slug": "convocat-ria-mambas",
                "excerpt": "𝐂𝐡𝐢𝐪𝐮𝐢𝐧𝐡𝐨 𝐂𝐨𝐧𝐝𝐞 𝐝𝐢𝐯𝐮𝐥𝐠𝐚 𝐩𝐫𝐞́-𝐜𝐨𝐧𝐯𝐨𝐜𝐚𝐭𝐨́𝐫𝐢𝐚 𝐝𝐨𝐬 𝐌𝐚𝐦𝐛𝐚𝐬 𝐩𝐚𝐫𝐚 𝐚 𝐝𝐚𝐭𝐚 𝐅𝐈𝐅𝐀 𝐝𝐞 𝐍𝐨𝐯𝐞𝐦𝐛𝐫𝐨\n",
                "content": "𝐂𝐡𝐢𝐪𝐮𝐢𝐧𝐡𝐨 𝐂𝐨𝐧𝐝𝐞 𝐝𝐢𝐯𝐮𝐥𝐠𝐚 𝐩𝐫𝐞́-𝐜𝐨𝐧𝐯𝐨𝐜𝐚𝐭𝐨́𝐫𝐢𝐚 𝐝𝐨𝐬 𝐌𝐚𝐦𝐛𝐚𝐬 𝐩𝐚𝐫𝐚 𝐚 𝐝𝐚𝐭𝐚 𝐅𝐈𝐅𝐀 𝐝𝐞 𝐍𝐨𝐯𝐞𝐦𝐛𝐫𝐨\n\nO Seleccionador Nacional, Chiquinho Conde, anunciou a pré-convocatória da Selecção Nacional AA (Mambas) para a Data FIFA de 10 a 18 de Novembro de 2025, inserida no ciclo de preparação a 35ª edição do Campeonato Africano das Nações a ter lugar em Marrocos, de 21 de dezembro de 2025 a 18 de janeiro de 2026.\n\nDurante este período, Moçambique irá defrontar a selecção de Marrocos, no dia 14 de Novembro, na cidade de Agadir, em jogo de carácter particular. Estão igualmente a ser criadas condições para a realização de mais um jogo de preparação, cujo adversário e data serão oportunamente confirmados, reforçando o compromisso da Federação Moçambicana de Futebol em proporcionar ao combinado nacional maior competitividade e ritmo internacional.\n\nA lista integra 40 jogadores que actuam tanto no campeonato nacional como em clubes estrangeiros, evidenciando a aposta do seleccionador na continuidade, competitividade e valorização do talento moçambicano dentro e fora do país.\n\nEis a lista dos pré-convocados por posição:\n\nGuarda-redes (6): Ernan Siluane (Associação Black Bulls), Fasistêncio Faza “Fazito” (Ferroviário de Nampula), Teixeira Nhanombe (Associação Black Bulls), Ivane Urrubal (Ferroviário de Nacala), Kimiss Zavala (Marítimo - Portugal), José Ventura Guirrugo (Ferroviário de Maputo).\n\nDefesas (12): Domingos Macandza “Mexer” (Associação Black Bulls), Edmilson Dove (Al-Quwa Al-Jawiya – Iraque), Bruno Langa (Pafos FC – Chipre), Reinildo Mandava (Sunderland AFC – Inglaterra), Infren Matola (UD Songo), Diogo Calila (Santa Clara – Portugal), Oscar Cherene (UD Songo), Manuel Cumbane “Guebuza” (Académico de Viseu – Portugal), Francisco Muchanga “Chico” (Costa do Sol), Edson Sitoe “Mexer” (Ankara Keçiorengucu – Turquia), Feliciano Jone “Nené” (Abu Salim SC – Líbia), Fernando Chambuco (Associação Black Bulls).\n\nMédios (10): Alfonso Amade (Dunfermline Athletic – Escócia), João Bonde (Ferroviário da Beira), Ricardo Guimarães “Guima” (Zira FK – Azerbaijão), Manuel Kambala (Polokwane City – África do Sul), Keyns Abdala (GD Chaves – Portugal), Ezequiel Machava (Ferroviário de Maputo), Pedro Santos “Pepo” (Caldas SC – Portugal), Shaquille Nangy (Sagrada Esperança – Angola), Elias Pelembe “Domingues” (UD Songo), Sapane Zunguze “Sampaio” (Ferroviário de Maputo).\n\nAvançados (12): Clésio Bauque (Associação Black Bulls), Geny Catamo (Sporting CP – Portugal), Witiness Quembo “Witi” (Nacional da Madeira – Portugal), Gildo Vilanculos (Tandamon Sour Club – Líbano), Stanley Ratifo (Chemie Leipzig – Alemanha), Faizal Bangal (AC Mestre – Itália), António Sumbane (Associação Black Bulls), Ângelo Cantolo (Chingale de Tete), Luís Miquissone (UD Songo), Elias Macamo (Ferroviário de Maputo), Chamito Alfandega (Académico de Viseu – Portugal), Melque Alexandre (UD Songo).\n\n",
                "category": "Nacional",
                "image_url": "https://futmz.onrender.com/uploads/c558c444-a540-4303-8e24-86da70f86864.jpg",
                "published": True,
                "featured": True,
                "author_id": user_id_map.get(1, admin.id)
            },
            {
                "title": "🇲🇿⚽ 𝐌𝐀𝐏𝐔𝐓𝐎 𝐀𝐂𝐎𝐋𝐇𝐄 𝐖𝐎𝐑𝐊𝐒𝐇𝐎𝐏 𝐃𝐄 𝐒𝐄𝐆𝐔𝐑𝐀𝐍𝐂̧𝐀 𝐃𝐀 𝐂𝐀𝐅",
                "slug": "",
                "excerpt": "De 28 a 30 de Outubro, a CAF e a FMF realizam o Workshop de Segurança e Protecção no âmbito da 🌍 Safe Stadium Initiative - uma missão com um objectivo claro: ZERO mortes em jogos de futebol em África! 🙌",
                "content": "🇲🇿⚽ 𝐌𝐀𝐏𝐔𝐓𝐎 𝐀𝐂𝐎𝐋𝐇𝐄 𝐖𝐎𝐑𝐊𝐒𝐇𝐎𝐏 𝐃𝐄 𝐒𝐄𝐆𝐔𝐑𝐀𝐍𝐂̧𝐀 𝐃𝐀 𝐂𝐀𝐅\n\nDe 28 a 30 de Outubro, a CAF e a FMF realizam o Workshop de Segurança e Protecção no âmbito da 🌍 Safe Stadium Initiative - uma missão com um objectivo claro: ZERO mortes em jogos de futebol em África! 🙌\n\n👮‍♂️ Participam oficiais de segurança de clubes, polícia, segurança privada e entidades governamentais.\n📚 Temas: gestão de multidões, controlo de acessos, bilhética, planos de emergência e muito mais!\n\nA FMF reafirma o seu compromisso em tornar o futebol moçambicano mais seguro, organizado e profissional. 💪🇲🇿\n\nLeia mais em: https://fmf.co.mz/news/details/982\n\nFMF🇲🇿⚽ 𝐌𝐀𝐏𝐔𝐓𝐎 𝐀𝐂𝐎𝐋𝐇𝐄 𝐖𝐎𝐑𝐊𝐒𝐇𝐎𝐏 𝐃𝐄 𝐒𝐄𝐆𝐔𝐑𝐀𝐍𝐂̧𝐀 𝐃𝐀 𝐂𝐀𝐅\n\nDe 28 a 30 de Outubro, a CAF e a FMF realizam o Workshop de Segurança e Protecção no âmbito da 🌍 Safe Stadium Initiative - uma missão com um objectivo claro: ZERO mortes em jogos de futebol em África! 🙌\n\n👮‍♂️ Participam oficiais de segurança de clubes, polícia, segurança privada e entidades governamentais.\n📚 Temas: gestão de multidões, controlo de acessos, bilhética, planos de emergência e muito mais!\n\nA FMF reafirma o seu compromisso em tornar o futebol moçambicano mais seguro, organizado e profissional. 💪🇲🇿\n\nLeia mais em: https://fmf.co.mz/news/details/982\n",
                "category": "Nacional",
                "image_url": "https://futmz.onrender.com/uploads/7248d702-d2fb-45c3-ae8d-cb298c71c365.jpg",
                "published": True,
                "featured": False,
                "author_id": user_id_map.get(1, admin.id)
            },
            {
                "title": "🏟️ 𝐌𝐀𝐒𝐒𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎 𝐃𝐎 𝐅𝐔𝐓𝐄𝐁𝐎𝐋 𝐍𝐀 𝐙𝐀𝐌𝐁𝐄́𝐙𝐈𝐀 𝐆𝐀𝐍𝐇𝐀 𝐑𝐄𝐅𝐎𝐑𝐂̧𝐎! ⚽",
                "slug": "-1",
                "excerpt": "Dando seguimento à visita de trabalho à Província da Zambézia, a delegação liderada pelo Presidente da Federação Moçambicana de Futebol, Feizal Sidat, procedeu à entrega de 1200 bolas de futebol a 22 distritos da província.",
                "content": "🏟️ 𝐌𝐀𝐒𝐒𝐈𝐅𝐈𝐂𝐀𝐂̧𝐀̃𝐎 𝐃𝐎 𝐅𝐔𝐓𝐄𝐁𝐎𝐋 𝐍𝐀 𝐙𝐀𝐌𝐁𝐄́𝐙𝐈𝐀 𝐆𝐀𝐍𝐇𝐀 𝐑𝐄𝐅𝐎𝐑𝐂̧𝐎! ⚽\n\nDando seguimento à visita de trabalho à Província da Zambézia, a delegação liderada pelo Presidente da Federação Moçambicana de Futebol, Feizal Sidat, procedeu à entrega de 1200 bolas de futebol a 22 distritos da província.\n\nA iniciativa enquadra-se no programa FIFA Football for Schools e tem como principal objectivo impulsionar a prática desportiva nas escolas e comunidades locais, contribuindo para o desenvolvimento do futebol de base. 📦⚽\n\nA cerimónia contou com a presença de:\n✅ Feizal Sidat 🔘 Presidente da FMF\n✅ Mariza Rosário 🔘 Presidente da Associação Provincial de Futebol da Zambézia\n✅ José Maria Lobo 🔘 Director Provincial da Juventude, Emprego e Desporto\n✅ Entre outras figuras locais\n\nCom esta acção, a FMF reforça o seu compromisso com a descentralização e a massificação do futebol em todo o território nacional.\n\nA missão da FMF prossegue na Província de Tete, onde novas actividades estão programadas. 💪🇲🇿\n\n#FIFAFootballForSchools #FIFAForward\n#FutebolMoçambicano #Zambézia #DesenvolvimentoDoFutebol\n\nFMF",
                "category": "Nacional",
                "image_url": "https://futmz.onrender.com/uploads/945a1eea-f048-41ba-8230-d09970b90db7.jpg",
                "published": True,
                "featured": True,
                "author_id": user_id_map.get(1, admin.id)
            }
        ]

        created_count = 0
        for article_data in sample_articles:
            existing = db.query(Article).filter(Article.slug == article_data["slug"]).first()
            if not existing:
                article = Article(**article_data)
                db.add(article)
                created_count += 1
                print(f"✅ Artigo criado: {article_data['title']}")
            else:
                print(f"ℹ️  Artigo já existe: {article_data['title']}")

        db.commit()

        return {
            "message": "Setup concluído com sucesso!",
            "users_created": 5,
            "articles_created": created_count,
            "total_articles_available": 6
        }