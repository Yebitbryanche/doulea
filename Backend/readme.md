# backend do's and dont's 

make sure you have python installed version 10+

1. creaate a virtual environment 

bash```
    python venv -m venv
    ```

2. Activate the virtual environment

## Windows
bash```
 venv/Scripts/Activate.ps1```  

## linux or mac
bash```
 venv/bin/activate```

3. install dependencies from the requirement.txt file

bash```
    pip install -r requirements.txt```

4. after all dependencies have been installed go to your xampp controll pannel, activate it and open your local host on port 3806
5. create a database /*doulea_db*/ in your phpmyAdmin dashboard
6. now return to your terminal and run 
bash```
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload``` thiswill help in connecting to your expoGo on your mobile device 
7. once the application is running you will see this

INFO:     Will watch for changes in these directories: ['C:\\Users\\Bryan\\Desktop\\work\\Doulea\\backend\\app']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [1688] using WatchFiles
Warning: You are sending unauthenticated requests to the HF Hub. Please set a HF_TOKEN to enable higher rate limits and faster downloads.
Loading weights: 100%|███████████████████████████████████████████████████████████████████████████████████████████████████████| 103/103 [00:00<00:00, 1560.49it/s]
BertModel LOAD REPORT from: sentence-transformers/all-MiniLM-L6-v2
Key                     | Status     |  | 
------------------------+------------+--+-
embeddings.position_ids | UNEXPECTED |  | 

Notes:
- UNEXPECTED    :can be ignored when loading from different task/architecture; not ok if you expect identical arch.
INFO:     Started server process [10972]
INFO:     Waiting for application startup.
2026-04-04 19:25:01,254 INFO sqlalchemy.engine.Engine SELECT DATABASE()
2026-04-04 19:25:01,255 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,259 INFO sqlalchemy.engine.Engine SELECT @@sql_mode
2026-04-04 19:25:01,260 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,262 INFO sqlalchemy.engine.Engine SELECT @@lower_case_table_names
2026-04-04 19:25:01,262 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,266 INFO sqlalchemy.engine.Engine BEGIN (implicit)
2026-04-04 19:25:01,267 INFO sqlalchemy.engine.Engine DESCRIBE `doulea_db`.`user`
2026-04-04 19:25:01,268 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,329 INFO sqlalchemy.engine.Engine DESCRIBE `doulea_db`.`employer_ratings`
2026-04-04 19:25:01,329 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,359 INFO sqlalchemy.engine.Engine DESCRIBE `doulea_db`.`subscriptions`
2026-04-04 19:25:01,360 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,379 INFO sqlalchemy.engine.Engine DESCRIBE `doulea_db`.`payments`
2026-04-04 19:25:01,380 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,397 INFO sqlalchemy.engine.Engine DESCRIBE `doulea_db`.`jobs`
2026-04-04 19:25:01,398 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,423 INFO sqlalchemy.engine.Engine DESCRIBE `doulea_db`.`job_likes`
2026-04-04 19:25:01,424 INFO sqlalchemy.engine.Engine [raw sql] {}
2026-04-04 19:25:01,444 INFO sqlalchemy.engine.Engine COMMIT
INFO:     Application startup complete.