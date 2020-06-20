import asyncio
from ariadne import QueryType, make_executable_schema, SubscriptionType, MutationType
from ariadne.asgi import GraphQL
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
import uvicorn
from broadcaster import Broadcast
import json

from data import Scan

type_defs = """
    type Scan {
        scanning: Boolean!
        cells: [Cell!]
    }
    type Cell {
        row: Int!
        col: Int!
        name: String!
    }
    type Mutation {
        start: Boolean
        stop: Boolean
    }
    type Query {
        read_board: [Cell!]!
    }
    type Subscription {
        scan_updates: Scan!
    }
"""


broadcast = Broadcast("redis://localhost:6379")
SCAN_CHANNEL = "scan_updates"

query = QueryType()
mutation = MutationType()
subscription = SubscriptionType()


async def publish_scan_update(str: str):
    print('publishing', str)
    await broadcast.publish(channel=SCAN_CHANNEL, message=json.dumps(str))

scan = Scan(publish=publish_scan_update)


@query.field("read_board")
def read_board(*_):
    return scan.read_board()


@mutation.field("start")
def resolve_start(*_):
    print('resolve_start')
    scan.startScanning()
    return None


@mutation.field("stop")
def resolve_stop(*_):
    scan.stopScanning()
    return None


@subscription.source("scan_updates")
async def scan_updates(obj, info):
    async with broadcast.subscribe(channel=SCAN_CHANNEL) as subscriber:
        async for event in subscriber:
            yield json.loads(event.message)


@subscription.field("scan_updates")
def scan_resolver(data, info):
    return data


schema = make_executable_schema(type_defs, query, mutation, subscription)

middleware = [
    Middleware(CORSMiddleware, allow_origins=['http://localhost:3000'], allow_methods=[
               'GET', 'POST'], allow_headers=['*'], expose_headers=['*'])
]

app = Starlette(debug=True, on_startup=[broadcast.connect], on_shutdown=[
                broadcast.disconnect], middleware=middleware)
app.mount("/graphql", GraphQL(schema, debug=True))

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=5000)
