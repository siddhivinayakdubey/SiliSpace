from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import random
import string
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

# Security
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# =========================
# Models
# =========================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: EmailStr
    name: str
    password_hash: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class Room(BaseModel):
    model_config = ConfigDict(extra="ignore")
    code: str
    partner1_email: Optional[str] = None
    partner2_email: Optional[str] = None
    partner1_name: Optional[str] = None
    partner2_name: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class RoomCreate(BaseModel):
    partner_name: str

class RoomJoin(BaseModel):
    code: str
    partner_name: str

class Flower(BaseModel):
    model_config = ConfigDict(extra="ignore")
    room_code: str
    sender: str
    flower_type: str
    message: Optional[str] = None
    sent_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class FlowerCreate(BaseModel):
    room_code: str
    sender: str
    flower_type: str
    message: Optional[str] = None

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    room_code: str
    sender: str
    content: str
    sent_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MessageCreate(BaseModel):
    room_code: str
    sender: str
    content: str

class Countdown(BaseModel):
    model_config = ConfigDict(extra="ignore")
    room_code: str
    event_name: str
    target_date: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CountdownCreate(BaseModel):
    room_code: str
    event_name: str
    target_date: str

class BucketListItem(BaseModel):
    text: str
    completed: bool = False

class BucketList(BaseModel):
    model_config = ConfigDict(extra="ignore")
    room_code: str
    items: List[BucketListItem] = []

class BucketListUpdate(BaseModel):
    room_code: str
    items: List[BucketListItem]

class VirtualHug(BaseModel):
    model_config = ConfigDict(extra="ignore")
    room_code: str
    sender: str
    hug_type: str
    sent_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class VirtualHugCreate(BaseModel):
    room_code: str
    sender: str
    hug_type: str

class ValentineCard(BaseModel):
    model_config = ConfigDict(extra="ignore")
    room_code: str
    sender: str
    card_type: str
    message: str
    sent_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ValentineCardCreate(BaseModel):
    room_code: str
    sender: str
    card_type: str
    message: str

# =========================
# Helper Functions
# =========================

def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# =========================
# Routes
# =========================

@api_router.get("/")
async def root():
    return {"message": "Distance Hug API"}

# Room Routes
@api_router.post("/rooms/create")
async def create_room(room_data: RoomCreate):
    code = generate_room_code()
    
    # Check if code exists
    existing = await db.rooms.find_one({"code": code}, {"_id": 0})
    while existing:
        code = generate_room_code()
        existing = await db.rooms.find_one({"code": code}, {"_id": 0})
    
    room = Room(
        code=code,
        partner1_name=room_data.partner_name
    )
    
    await db.rooms.insert_one(room.model_dump())
    return {"code": code, "partner_name": room_data.partner_name}

@api_router.post("/rooms/join")
async def join_room(join_data: RoomJoin):
    room = await db.rooms.find_one({"code": join_data.code}, {"_id": 0})
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room.get("partner2_name"):
        raise HTTPException(status_code=400, detail="Room is full")
    
    await db.rooms.update_one(
        {"code": join_data.code},
        {"$set": {"partner2_name": join_data.partner_name}}
    )
    
    return {
        "code": join_data.code,
        "partner1_name": room.get("partner1_name"),
        "partner2_name": join_data.partner_name
    }

@api_router.get("/rooms/{code}")
async def get_room(code: str):
    room = await db.rooms.find_one({"code": code}, {"_id": 0})
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    return room

# Flower Routes
@api_router.post("/flowers/send")
async def send_flower(flower_data: FlowerCreate):
    flower = Flower(**flower_data.model_dump())
    await db.flowers.insert_one(flower.model_dump())
    return {"success": True}

@api_router.get("/flowers/{room_code}")
async def get_flowers(room_code: str):
    flowers = await db.flowers.find({"room_code": room_code}, {"_id": 0}).sort("sent_at", -1).to_list(100)
    return flowers

# Message Routes
@api_router.post("/messages/send")
async def send_message(message_data: MessageCreate):
    message = Message(**message_data.model_dump())
    await db.messages.insert_one(message.model_dump())
    return {"success": True}

@api_router.get("/messages/{room_code}")
async def get_messages(room_code: str):
    messages = await db.messages.find({"room_code": room_code}, {"_id": 0}).sort("sent_at", -1).to_list(100)
    return messages

# Countdown Routes
@api_router.post("/countdown/set")
async def set_countdown(countdown_data: CountdownCreate):
    existing = await db.countdowns.find_one({"room_code": countdown_data.room_code})
    
    if existing:
        await db.countdowns.update_one(
            {"room_code": countdown_data.room_code},
            {"$set": {
                "event_name": countdown_data.event_name,
                "target_date": countdown_data.target_date
            }}
        )
    else:
        countdown = Countdown(**countdown_data.model_dump())
        await db.countdowns.insert_one(countdown.model_dump())
    
    return {"success": True}

@api_router.get("/countdown/{room_code}")
async def get_countdown(room_code: str):
    countdown = await db.countdowns.find_one({"room_code": room_code}, {"_id": 0})
    return countdown if countdown else None

# Bucket List Routes
@api_router.post("/bucketlist/update")
async def update_bucket_list(bucket_data: BucketListUpdate):
    existing = await db.bucketlists.find_one({"room_code": bucket_data.room_code})
    
    if existing:
        await db.bucketlists.update_one(
            {"room_code": bucket_data.room_code},
            {"$set": {"items": [item.model_dump() for item in bucket_data.items]}}
        )
    else:
        bucket_list = BucketList(
            room_code=bucket_data.room_code,
            items=bucket_data.items
        )
        await db.bucketlists.insert_one(bucket_list.model_dump())
    
    return {"success": True}

@api_router.get("/bucketlist/{room_code}")
async def get_bucket_list(room_code: str):
    bucket_list = await db.bucketlists.find_one({"room_code": room_code}, {"_id": 0})
    return bucket_list if bucket_list else {"room_code": room_code, "items": []}

# Virtual Hug Routes
@api_router.post("/hugs/send")
async def send_hug(hug_data: VirtualHugCreate):
    hug = VirtualHug(**hug_data.model_dump())
    await db.hugs.insert_one(hug.model_dump())
    return {"success": True}

@api_router.get("/hugs/{room_code}")
async def get_hugs(room_code: str):
    hugs = await db.hugs.find({"room_code": room_code}, {"_id": 0}).sort("sent_at", -1).to_list(50)
    return hugs

# Valentine Card Routes
@api_router.post("/valentine/send")
async def send_valentine_card(card_data: ValentineCardCreate):
    card = ValentineCard(**card_data.model_dump())
    await db.valentine_cards.insert_one(card.model_dump())
    return {"success": True}

@api_router.get("/valentine/{room_code}")
async def get_valentine_cards(room_code: str):
    cards = await db.valentine_cards.find({"room_code": room_code}, {"_id": 0}).sort("sent_at", -1).to_list(50)
    return cards

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()