from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Team
from schemas import TeamCreate, TeamUpdate, TeamResponse
from dependencies import get_current_admin_user
from routers.auth import User

router = APIRouter()

@router.get("/", response_model=List[TeamResponse])
def list_teams(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Lista todas as equipas"""
    teams = db.query(Team).offset(skip).limit(limit).all()
    return teams

@router.get("/{team_id}", response_model=TeamResponse)
def get_team(team_id: int, db: Session = Depends(get_db)):
    """Busca uma equipa específica"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Equipa não encontrada")
    return team

@router.post("/", response_model=TeamResponse)
def create_team(team: TeamCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Cria uma nova equipa (apenas admin)"""
    # Verificar se já existe
    existing = db.query(Team).filter(Team.name == team.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Equipa já existe")
    
    db_team = Team(**team.model_dump())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@router.put("/{team_id}", response_model=TeamResponse)
def update_team(team_id: int, team_update: TeamUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Atualiza uma equipa (apenas admin)"""
    db_team = db.query(Team).filter(Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipa não encontrada")
    
    # Verificar se o novo nome já existe
    if team_update.name and team_update.name != db_team.name:
        existing = db.query(Team).filter(Team.name == team_update.name).first()
        if existing:
            raise HTTPException(status_code=400, detail="Nome de equipa já existe")
    
    # Atualizar campos
    for key, value in team_update.model_dump(exclude_unset=True).items():
        setattr(db_team, key, value)
    
    db.commit()
    db.refresh(db_team)
    return db_team

@router.delete("/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Deleta uma equipa (apenas admin)"""
    db_team = db.query(Team).filter(Team.id == team_id).first()
    if not db_team:
        raise HTTPException(status_code=404, detail="Equipa não encontrada")
    
    db.delete(db_team)
    db.commit()
    return {"message": "Equipa deletada com sucesso"}

