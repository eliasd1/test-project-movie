INSERT INTO account(userName, password, isLoggedIn)
VALUES('name', '123', TRUE) 
ON CONFLICT ON CONSTRAINT account_name
DO NOTHING;

INSERT INTO game(score, user_id)
VALUES('9', (SELECT id FROM account WHERE userName = 'name'));