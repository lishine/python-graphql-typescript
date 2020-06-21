## The actual code is in
- app.py
- data.py

## Install

- Install python3

```shell
virtualenv env
source ./env/bin/activate
python install -r requirements.txt
```

## Develop

- Run Redis

```shell
docker-compose up -d
```

Run server

```shell
python app.py
```

## Vscode extensions

- Python
- Pyright
