CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    symbol TEXT NOT NULL,          -- 资产代码 (如 BTC, AAPL)
    type TEXT NOT NULL,            -- 'BUY' 或 'SELL'
    amount REAL NOT NULL,          -- 交易数量
    price REAL NOT NULL,           -- 交易单价
    currency TEXT DEFAULT 'USD',   -- 货币类型
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);