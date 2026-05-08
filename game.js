const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// =====================================
// CONSTANTS
// =====================================

const GRAVITY = 0.7;
const JUMP_FORCE = -15;
const GROUND_HEIGHT = 120;
const PLAYER_SPEED = 4;

// =====================================
// UI
// =====================================

const UI = {
    wordBox: document.getElementById("wordBox"),
    wordText: document.getElementById("wordText"),
    correctScore: document.getElementById("correctScore"),
    incorrectScore: document.getElementById("incorrectScore"),
    genderBtns: {
        all: document.getElementById("genderAll"),
        der: document.getElementById("genderDer"),
        die: document.getElementById("genderDie"),
        das: document.getElementById("genderDas")
    }
};

let selectedGender = "all";
let score = { positive: 0, negative: 0 };

// =====================================
// PLAYER
// =====================================

const player = {
    x: 200,
    y: 0,
    width: 50,
    height: 70,
    velocityY: 0,
    onGround: false
};

function getGroundY() {
    return canvas.height - GROUND_HEIGHT - player.height;
}

player.y = getGroundY();

// =====================================
// CAMERA
// =====================================

const camera = {
    x: 0
};

// =====================================
// VOCABULARY OBJECTS
// =====================================

const vocabulary = [
    {english:"Man",german:"der Mann",gender:"der",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"},
    {english:"Boy",german:"der Junge",gender:"der",image:"https://images.unsplash.com/photo-1503454537688-e6c6ff1e7178?w=200&h=200&fit=crop"},
    {english:"Friend",german:"der Freund",gender:"der",image:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop"},
    {english:"Father",german:"der Vater",gender:"der",image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"},
    {english:"Brother",german:"der Bruder",gender:"der",image:"https://images.unsplash.com/photo-1519085360771-9852372b739d?w=200&h=200&fit=crop"},
    {english:"Son",german:"der Sohn",gender:"der",image:"https://images.unsplash.com/photo-1515488764276-beaab60d8374?w=200&h=200&fit=crop"},
    {english:"Grandfather",german:"der Opa",gender:"der",image:"https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop"},
    {english:"Dog",german:"der Hund",gender:"der",image:"https://images.unsplash.com/photo-1633722715463-d30628519d4f?w=200&h=200&fit=crop"},
    {english:"Woman",german:"die Frau",gender:"die",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"},
    {english:"Girl",german:"das Mädchen",gender:"das",image:"https://images.unsplash.com/photo-1503454537688-e6c6ff1e7178?w=200&h=200&fit=crop"},
    {english:"Sister",german:"die Schwester",gender:"die",image:"https://images.unsplash.com/photo-1519085360771-9852372b739d?w=200&h=200&fit=crop"},
    {english:"Mother",german:"die Mutter",gender:"die",image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"},
    {english:"Daughter",german:"die Tochter",gender:"die",image:"https://images.unsplash.com/photo-1503454537688-e6c6ff1e7178?w=200&h=200&fit=crop"},
    {english:"Grandmother",german:"die Oma",gender:"die",image:"https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop"},
    {english:"Cat",german:"die Katze",gender:"die",image:"https://images.unsplash.com/photo-1574158622682-e40c69881006?w=200&h=200&fit=crop"},
    {english:"Bus",german:"der Bus",gender:"der",image:"https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=200&h=200&fit=crop"},
    {english:"Car",german:"das Auto",gender:"das",image:"https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=200&h=200&fit=crop"},
    {english:"Chair",german:"der Stuhl",gender:"der",image:"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&h=200&fit=crop"},
    {english:"Table",german:"der Tisch",gender:"der",image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop"},
    {english:"Desk",german:"der Schreibtisch",gender:"der",image:"https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&h=200&fit=crop"},
    {english:"Bed",german:"das Bett",gender:"das",image:"https://images.unsplash.com/photo-1540932239986-310128078ceb?w=200&h=200&fit=crop"},
    {english:"Book",german:"das Buch",gender:"das",image:"https://images.unsplash.com/photo-1507842217343-583684e8d8d1?w=200&h=200&fit=crop"},
    {english:"Lamp",german:"die Lampe",gender:"die",image:"https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=200&h=200&fit=crop"},
    {english:"Apple",german:"der Apfel",gender:"der",image:"https://images.unsplash.com/photo-1560806674-04ec589213cb?w=200&h=200&fit=crop"},
    {english:"Banana",german:"die Banane",gender:"die",image:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop"},
    {english:"Orange",german:"die Orange",gender:"die",image:"https://images.unsplash.com/photo-1599810694-b3b2c6b5e313?w=200&h=200&fit=crop"},
    {english:"Bread",german:"das Brot",gender:"das",image:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop"},
    {english:"Milk",german:"die Milch",gender:"die",image:"https://images.unsplash.com/photo-1563056169-519f102b37c0?w=200&h=200&fit=crop"},
    {english:"Coffee",german:"der Kaffee",gender:"der",image:"https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=200&h=200&fit=crop"},
    {english:"Water",german:"das Wasser",gender:"das",image:"https://images.unsplash.com/photo-1508252847677-30e08d4055da?w=200&h=200&fit=crop"},
    {english:"Tree",german:"der Baum",gender:"der",image:"https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=200&h=200&fit=crop"},
    {english:"Flower",german:"die Blume",gender:"die",image:"https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=200&h=200&fit=crop"},
    {english:"House",german:"das Haus",gender:"das",image:"https://images.unsplash.com/photo-1570129476519-bbf64147e3cc?w=200&h=200&fit=crop"},
    {english:"Door",german:"die Tür",gender:"die",image:"https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=200&fit=crop"},
    {english:"Window",german:"das Fenster",gender:"das",image:"https://images.unsplash.com/photo-1552148795-186e2f2c0fb5?w=200&h=200&fit=crop"},
    {english:"Mountain",german:"der Berg",gender:"der",image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"},
    {english:"River",german:"der Fluss",gender:"der",image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"},
    {english:"Beach",german:"der Strand",gender:"der",image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop"},
    {english:"Sun",german:"die Sonne",gender:"die",image:"https://images.unsplash.com/photo-1495567720989-cebddb0ef005?w=200&h=200&fit=crop"},
    {english:"Moon",german:"der Mond",gender:"der",image:"https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=200&h=200&fit=crop"},
    {english:"Star",german:"der Stern",gender:"der",image:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&h=200&fit=crop"},
    {english:"Cloud",german:"die Wolke",gender:"die",image:"https://images.unsplash.com/photo-1495227794979-39b1ea6ce11f?w=200&h=200&fit=crop"},
    {english:"Rain",german:"der Regen",gender:"der",image:"https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=200&fit=crop"},
    {english:"Snow",german:"der Schnee",gender:"der",image:"https://images.unsplash.com/photo-1517816832347-70e0e54988e9?w=200&h=200&fit=crop"},
    {english:"Wind",german:"der Wind",gender:"der",image:"https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=200&fit=crop"},
    {english:"Eye",german:"das Auge",gender:"das",image:"https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=200&h=200&fit=crop"},
    {english:"Nose",german:"die Nase",gender:"die",image:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop"},
    {english:"Mouth",german:"der Mund",gender:"der",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"},
    {english:"Hand",german:"die Hand",gender:"die",image:"https://images.unsplash.com/photo-1532619675605-1ede6c2b7c50?w=200&h=200&fit=crop"},
    {english:"Foot",german:"der Fuß",gender:"der",image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop"},
    {english:"Heart",german:"das Herz",gender:"das",image:"https://images.unsplash.com/photo-1462664305264-f6c03bd66e5a?w=200&h=200&fit=crop"},
    {english:"Head",german:"der Kopf",gender:"der",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"},
    {english:"Arm",german:"der Arm",gender:"der",image:"https://images.unsplash.com/photo-1532619675605-1ede6c2b7c50?w=200&h=200&fit=crop"},
    {english:"Leg",german:"das Bein",gender:"das",image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop"},
    {english:"School",german:"die Schule",gender:"die",image:"https://images.unsplash.com/photo-1523306335684-37898b6baf30?w=200&h=200&fit=crop"},
    {english:"Hospital",german:"das Krankenhaus",gender:"das",image:"https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=200&h=200&fit=crop"},
    {english:"Church",german:"die Kirche",gender:"die",image:"https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=200&h=200&fit=crop"},
    {english:"Shop",german:"das Geschäft",gender:"das",image:"https://images.unsplash.com/photo-1460925895917-adf4198c838f?w=200&h=200&fit=crop"},
    {english:"Market",german:"der Markt",gender:"der",image:"https://images.unsplash.com/photo-1580985571023-a97a60b332d6?w=200&h=200&fit=crop"},
    {english:"Park",german:"der Park",gender:"der",image:"https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=200&h=200&fit=crop"},
    {english:"Zoo",german:"der Zoo",gender:"der",image:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop"},
    {english:"Garden",german:"der Garten",gender:"der",image:"https://images.unsplash.com/photo-1466070364189-0e8cc99fbb0f?w=200&h=200&fit=crop"},
    {english:"Forest",german:"der Wald",gender:"der",image:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop"},
    {english:"Movie",german:"der Film",gender:"der",image:"https://images.unsplash.com/photo-1498567641960-5dd38dc30b2d?w=200&h=200&fit=crop"},
    {english:"Music",german:"die Musik",gender:"die",image:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop"},
    {english:"Dance",german:"der Tanz",gender:"der",image:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&h=200&fit=crop"},
    {english:"Song",german:"das Lied",gender:"das",image:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"},
    {english:"Sport",german:"der Sport",gender:"der",image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop"},
    {english:"Game",german:"das Spiel",gender:"das",image:"https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=200&h=200&fit=crop"},
    {english:"Ball",german:"der Ball",gender:"der",image:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop"},
    {english:"Cup",german:"die Tasse",gender:"die",image:"https://images.unsplash.com/photo-1556742208-999c6676db52?w=200&h=200&fit=crop"},
    {english:"Plate",german:"der Teller",gender:"der",image:"https://images.unsplash.com/photo-1511689534487-db7d006cb258?w=200&h=200&fit=crop"},
    {english:"Glass",german:"das Glas",gender:"das",image:"https://images.unsplash.com/photo-1516981957308-d7e68e6e5ee6?w=200&h=200&fit=crop"},
    {english:"Bottle",german:"die Flasche",gender:"die",image:"https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=200&h=200&fit=crop"},
    {english:"Knife",german:"das Messer",gender:"das",image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"},
    {english:"Fork",german:"die Gabel",gender:"die",image:"https://images.unsplash.com/photo-1511689534487-db7d006cb258?w=200&h=200&fit=crop"},
    {english:"Spoon",german:"der Löffel",gender:"der",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop"},
    {english:"Pen",german:"der Stift",gender:"der",image:"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&h=200&fit=crop"},
    {english:"Pencil",german:"der Bleistift",gender:"der",image:"https://images.unsplash.com/photo-1546993169-83a9a62b0ea2?w=200&h=200&fit=crop"},
    {english:"Paper",german:"das Papier",gender:"das",image:"https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&h=200&fit=crop"},
    {english:"Clock",german:"die Uhr",gender:"die",image:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop"},
    {english:"Watch",german:"die Armbanduhr",gender:"die",image:"https://images.unsplash.com/photo-1523293182986-7651a8ad5763?w=200&h=200&fit=crop"},
    {english:"Phone",german:"das Telefon",gender:"das",image:"https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=200&h=200&fit=crop"},
    {english:"Computer",german:"der Computer",gender:"der",image:"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&h=200&fit=crop"},
    {english:"Keyboard",german:"die Tastatur",gender:"die",image:"https://images.unsplash.com/photo-1587829191301-e8d7b00f33bb?w=200&h=200&fit=crop"},
    {english:"Mouse",german:"die Maus",gender:"die",image:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop"},
    {english:"Screen",german:"der Bildschirm",gender:"der",image:"https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&h=200&fit=crop"},
    {english:"Shoe",german:"der Schuh",gender:"der",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop"},
    {english:"Hat",german:"der Hut",gender:"der",image:"https://images.unsplash.com/photo-1529115446996-b2c2844a8f8d?w=200&h=200&fit=crop"},
    {english:"Dress",german:"das Kleid",gender:"das",image:"https://images.unsplash.com/photo-1595777712802-26a06bb0d331?w=200&h=200&fit=crop"},
    {english:"Shirt",german:"das Hemd",gender:"das",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"},
    {english:"Pants",german:"die Hose",gender:"die",image:"https://images.unsplash.com/photo-1542272604-787c62d465d1?w=200&h=200&fit=crop"},
    {english:"Coat",german:"der Mantel",gender:"der",image:"https://images.unsplash.com/photo-1539533057592-4d2b7472e0a7?w=200&h=200&fit=crop"},
    {english:"Jacket",german:"die Jacke",gender:"die",image:"https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=200&h=200&fit=crop"},
    {english:"Sock",german:"die Socke",gender:"die",image:"https://images.unsplash.com/photo-1556821552-5f5e26e8c2ce?w=200&h=200&fit=crop"},
    {english:"Ring",german:"der Ring",gender:"der",image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop"},
    {english:"Necklace",german:"die Halskette",gender:"die",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop"},
    {english:"Bracelet",german:"das Armband",gender:"das",image:"https://images.unsplash.com/photo-1610703596007-11502861dcfa?w=200&h=200&fit=crop"},
    {english:"Camera",german:"die Kamera",gender:"die",image:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop"},
    {english:"Picture",german:"das Bild",gender:"das",image:"https://images.unsplash.com/photo-1493515169062-81342ee5ff30?w=200&h=200&fit=crop"},
    {english:"Bicycle",german:"das Fahrrad",gender:"das",image:"https://images.unsplash.com/photo-1529629128177-056cda37453b?w=200&h=200&fit=crop"},
    {english:"Motorcycle",german:"das Motorrad",gender:"das",image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"},
    {english:"Airplane",german:"das Flugzeug",gender:"das",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop"},
    {english:"Boat",german:"das Boot",gender:"das",image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop"},
    {english:"Train",german:"der Zug",gender:"der",image:"https://images.unsplash.com/photo-1531746790731-6c087fecd65b?w=200&h=200&fit=crop"},
    {english:"Ship",german:"das Schiff",gender:"das",image:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop"},
    {english:"Horse",german:"das Pferd",gender:"das",image:"https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=200&h=200&fit=crop"},
    {english:"Bird",german:"der Vogel",gender:"der",image:"https://images.unsplash.com/photo-1444464666175-1642156e4d4f?w=200&h=200&fit=crop"},
    {english:"Fish",german:"der Fisch",gender:"der",image:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop"},
    {english:"Butterfly",german:"der Schmetterling",gender:"der",image:"https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=200&h=200&fit=crop"},
    {english:"Bee",german:"die Biene",gender:"die",image:"https://images.unsplash.com/photo-1614613535308-eb5fbd8d2c17?w=200&h=200&fit=crop"},
    {english:"Spider",german:"die Spinne",gender:"die",image:"https://images.unsplash.com/photo-1519017602037-bc8c338bc4f7?w=200&h=200&fit=crop"},
    {english:"Lettuce",german:"der Salat",gender:"der",image:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop"},
    {english:"Tomato",german:"die Tomate",gender:"die",image:"https://images.unsplash.com/photo-1592924357228-91ec8b3be3a8?w=200&h=200&fit=crop"},
    {english:"Potato",german:"die Kartoffel",gender:"die",image:"https://images.unsplash.com/photo-1585029297518-c99aacd814d4?w=200&h=200&fit=crop"},
    {english:"Cheese",german:"der Käse",gender:"der",image:"https://images.unsplash.com/photo-1589190228754-a0f00c0e5d7f?w=200&h=200&fit=crop"},
    {english:"Butter",german:"die Butter",gender:"die",image:"https://images.unsplash.com/photo-1596040514211-3c5e4d80a743?w=200&h=200&fit=crop"},
    {english:"Egg",german:"das Ei",gender:"das",image:"https://images.unsplash.com/photo-1587381671554-417b0b3d2eb6?w=200&h=200&fit=crop"},
    {english:"Meat",german:"das Fleisch",gender:"das",image:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop"},
    {english:"Chicken",german:"das Huhn",gender:"das",image:"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop"},
    {english:"Pig",german:"das Schwein",gender:"das",image:"https://images.unsplash.com/photo-1578328543967-3da540557b13?w=200&h=200&fit=crop"},
    {english:"Cow",german:"die Kuh",gender:"die",image:"https://images.unsplash.com/photo-1580622787913-f3f25eac6a60?w=200&h=200&fit=crop"},
    {english:"Sheep",german:"das Schaf",gender:"das",image:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop"},
    {english:"Goat",german:"die Ziege",gender:"die",image:"https://images.unsplash.com/photo-1515413934304-0abc2c3d4e00?w=200&h=200&fit=crop"},
    {english:"Rabbit",german:"das Kaninchen",gender:"das",image:"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop"},
    {english:"Lion",german:"der Löwe",gender:"der",image:"https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=200&h=200&fit=crop"},
    {english:"Tiger",german:"der Tiger",gender:"der",image:"https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=200&h=200&fit=crop"},
    {english:"Elephant",german:"der Elefant",gender:"der",image:"https://images.unsplash.com/photo-1551717743-49959800b1f6?w=200&h=200&fit=crop"},
    {english:"Bear",german:"der Bär",gender:"der",image:"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop"},
    {english:"Monkey",german:"der Affe",gender:"der",image:"https://images.unsplash.com/photo-1551717743-49959800b1f6?w=200&h=200&fit=crop"},
    {english:"Penguin",german:"der Pinguin",gender:"der",image:"https://images.unsplash.com/photo-1564523715346-3ba5fef0d04b?w=200&h=200&fit=crop"},
    {english:"Duck",german:"die Ente",gender:"die",image:"https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=200&h=200&fit=crop"},
    {english:"Goose",german:"die Gans",gender:"die",image:"https://images.unsplash.com/photo-1534531173927-aeb928d54385?w=200&h=200&fit=crop"},
    {english:"Turkey",german:"die Pute",gender:"die",image:"https://images.unsplash.com/photo-1577720643272-265e434e2c7e?w=200&h=200&fit=crop"},
    {english:"Crocodile",german:"das Krokodil",gender:"das",image:"https://images.unsplash.com/photo-1564523715346-3ba5fef0d04b?w=200&h=200&fit=crop"},
    {english:"Snake",german:"die Schlange",gender:"die",image:"https://images.unsplash.com/photo-1577720643272-265e434e2c7e?w=200&h=200&fit=crop"},
    {english:"Turtle",german:"die Schildkröte",gender:"die",image:"https://images.unsplash.com/photo-1564523715346-3ba5fef0d04b?w=200&h=200&fit=crop"},
    {english:"Frog",german:"der Frosch",gender:"der",image:"https://images.unsplash.com/photo-1577720643272-265e434e2c7e?w=200&h=200&fit=crop"},
    {english:"Strawberry",german:"die Erdbeere",gender:"die",image:"https://images.unsplash.com/photo-1624256621225-01e74649a501?w=200&h=200&fit=crop"},
    {english:"Watermelon",german:"die Wassermelone",gender:"die",image:"https://images.unsplash.com/photo-1559155672-82dda4dd3a9e?w=200&h=200&fit=crop"},
    {english:"Lemon",german:"die Zitrone",gender:"die",image:"https://images.unsplash.com/photo-1595521680541-d48416b57ded?w=200&h=200&fit=crop"},
    {english:"Grape",german:"die Traube",gender:"die",image:"https://images.unsplash.com/photo-1605985628519-d77b53b13995?w=200&h=200&fit=crop"},
    {english:"Pineapple",german:"die Ananas",gender:"die",image:"https://images.unsplash.com/photo-1599040738304-abb7ceb42c1f?w=200&h=200&fit=crop"}
];

const objects = [];

let nextSpawnX = 600;

// =====================================
// IMAGE CACHE
// =====================================

const imageCache = {};

function loadImage(url) {
    if (!imageCache[url]) {
        const img = new Image();
        img.src = url;
        imageCache[url] = img;
    }
    return imageCache[url];
}

// Load all images
vocabulary.forEach(item => {
    loadImage(item.image);
});

// =====================================
// SPAWN OBJECTS
// =====================================

function spawnObject() {

    const filteredVocab = selectedGender === "all" 
        ? vocabulary 
        : vocabulary.filter(v => v.gender === selectedGender);

    if (filteredVocab.length === 0) return;

    const item = filteredVocab[Math.floor(Math.random() * filteredVocab.length)];

    objects.push({
        x: nextSpawnX,
        y: canvas.height - GROUND_HEIGHT - 100,
        width: 80,
        height: 80,
        english: item.english,
        german: item.german,
        gender: item.gender,
        image: item.image,
        collected: false
    });

    nextSpawnX += 250 + Math.random() * 250;
}

// Initial objects
for (let i = 0; i < 10; i++) {
    spawnObject();
}

// =====================================
// INPUT
// =====================================

window.addEventListener("keydown", (e) => {

    if (
        (e.code === "Space" || e.code === "ArrowUp") &&
        player.onGround
    ) {
        player.velocityY = JUMP_FORCE;
        player.onGround = false;
    }
});

// Gender filter buttons
UI.genderBtns.all.addEventListener("click", () => {
    selectedGender = "all";
    updateGenderButtons();
    resetScore();
    objects.length = 0;
    nextSpawnX = player.x + 600;
    for (let i = 0; i < 15; i++) spawnObject();
});

UI.genderBtns.der.addEventListener("click", () => {
    selectedGender = "der";
    updateGenderButtons();
    resetScore();
    objects.length = 0;
    nextSpawnX = player.x + 600;
    for (let i = 0; i < 15; i++) spawnObject();
});

UI.genderBtns.die.addEventListener("click", () => {
    selectedGender = "die";
    updateGenderButtons();
    resetScore();
    objects.length = 0;
    nextSpawnX = player.x + 600;
    for (let i = 0; i < 15; i++) spawnObject();
});

UI.genderBtns.das.addEventListener("click", () => {
    selectedGender = "das";
    updateGenderButtons();
    resetScore();
    objects.length = 0;
    nextSpawnX = player.x + 600;
    for (let i = 0; i < 15; i++) spawnObject();
});

function updateGenderButtons() {
    UI.genderBtns.all.classList.remove("active");
    UI.genderBtns.der.classList.remove("active");
    UI.genderBtns.die.classList.remove("active");
    UI.genderBtns.das.classList.remove("active");

    if (selectedGender === "all") UI.genderBtns.all.classList.add("active");
    else if (selectedGender === "der") UI.genderBtns.der.classList.add("active");
    else if (selectedGender === "die") UI.genderBtns.die.classList.add("active");
    else if (selectedGender === "das") UI.genderBtns.das.classList.add("active");
}

function resetScore() {
    score.positive = 0;
    score.negative = 0;
    UI.correctScore.textContent = "0";
    UI.incorrectScore.textContent = "0";
    UI.wordText.innerHTML = "Touch objects to learn German words";
    UI.wordText.style.color = "white";
}

// =====================================
// COLLISION
// =====================================

function isColliding(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// =====================================
// UPDATE
// =====================================

function update() {

    // Move forever
    player.x += PLAYER_SPEED;

    // Gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Ground collision
    const groundY = getGroundY();

    if (player.y >= groundY) {

        player.y = groundY;
        player.velocityY = 0;
        player.onGround = true;
    }

    // Camera follow
    camera.x = player.x - 200;

    // Spawn endlessly
    if (player.x + canvas.width > nextSpawnX - 800) {
        spawnObject();
    }

    // Object collisions
    objects.forEach((obj) => {

        if (!obj.collected && isColliding(player, obj)) {

            obj.collected = true;

            // Check if gender matches (or all genders selected)
            let isCorrect = selectedGender === "all" || obj.gender === selectedGender;

            if (isCorrect) {
                score.positive++;
                UI.wordText.innerHTML =
                    `✓ ${obj.english} → <strong>${obj.german}</strong>`;
                UI.wordText.style.color = "#4CAF50";
            } else {
                score.negative++;
                UI.wordText.innerHTML =
                    `✗ WRONG! ${obj.english} is <strong>${obj.german}</strong> (not ${selectedGender})`;
                UI.wordText.style.color = "#ff6b6b";
            }

            // Update score display
            UI.correctScore.textContent = score.positive;
            UI.incorrectScore.textContent = score.negative;
        }
    });
}

// =====================================
// DRAW SKY
// =====================================

function drawSky() {

    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun
    ctx.fillStyle = "#ffd166";

    ctx.beginPath();
    ctx.arc(120, 100, 50, 0, Math.PI * 2);
    ctx.fill();
}

// =====================================
// DRAW GROUND
// =====================================

function drawGround() {

    ctx.fillStyle = "#588157";

    ctx.fillRect(
        0,
        canvas.height - GROUND_HEIGHT,
        canvas.width,
        GROUND_HEIGHT
    );

    // Grass lines
    ctx.fillStyle = "#3a5a40";

    for (let i = 0; i < canvas.width; i += 40) {

        ctx.fillRect(
            i,
            canvas.height - GROUND_HEIGHT,
            20,
            6
        );
    }
}

// =====================================
// DRAW PLAYER
// =====================================

function drawPlayer() {

    const screenX = player.x - camera.x;

    // Body
    ctx.fillStyle = "#ff4d6d";

    ctx.fillRect(
        screenX,
        player.y,
        player.width,
        player.height
    );

    // Eyes
    ctx.fillStyle = "white";

    ctx.fillRect(screenX + 10, player.y + 15, 8, 8);
    ctx.fillRect(screenX + 30, player.y + 15, 8, 8);
}

// =====================================
// DRAW OBJECTS
// =====================================

function drawObjects() {

    objects.forEach((obj) => {

        const screenX = obj.x - camera.x;

        // Skip offscreen
        if (
            screenX < -100 ||
            screenX > canvas.width + 100
        ) {
            return;
        }

        const img = imageCache[obj.image];

        if (img && img.complete) {
            // Draw image with rounded corners effect
            ctx.save();
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetY = 3;
            
            // Create rounded rectangle path and draw image in it
            ctx.beginPath();
            const radius = 8;
            ctx.moveTo(screenX + radius, obj.y);
            ctx.lineTo(screenX + obj.width - radius, obj.y);
            ctx.quadraticCurveTo(screenX + obj.width, obj.y, screenX + obj.width, obj.y + radius);
            ctx.lineTo(screenX + obj.width, obj.y + obj.height - radius);
            ctx.quadraticCurveTo(screenX + obj.width, obj.y + obj.height, screenX + obj.width - radius, obj.y + obj.height);
            ctx.lineTo(screenX + radius, obj.y + obj.height);
            ctx.quadraticCurveTo(screenX, obj.y + obj.height, screenX, obj.y + obj.height - radius);
            ctx.lineTo(screenX, obj.y + radius);
            ctx.quadraticCurveTo(screenX, obj.y, screenX + radius, obj.y);
            ctx.closePath();
            ctx.clip();
            
            ctx.drawImage(img, screenX, obj.y, obj.width, obj.height);
            ctx.restore();
            
            // Draw border
            ctx.strokeStyle = obj.collected ? "#999" : "white";
            ctx.lineWidth = 3;
            ctx.strokeRect(screenX, obj.y, obj.width, obj.height);
        } else {
            // Fallback: draw gray rectangle while image loads
            ctx.fillStyle = obj.collected ? "#999" : "#e0e0e0";
            ctx.fillRect(screenX, obj.y, obj.width, obj.height);
            
            // Draw border
            ctx.strokeStyle = obj.collected ? "#999" : "white";
            ctx.lineWidth = 3;
            ctx.strokeRect(screenX, obj.y, obj.width, obj.height);
        }

        // Label with gender
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(screenX - 2, obj.y - 25, obj.width + 4, 24);
        
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            obj.gender.toUpperCase(),
            screenX + obj.width / 2,
            obj.y - 8
        );
    });
}

// =====================================
// GAME LOOP
// =====================================

function gameLoop() {

    update();

    drawSky();
    drawGround();
    drawObjects();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();