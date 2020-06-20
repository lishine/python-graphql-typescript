from typing import NamedTuple, Optional, List, TypedDict, Optional, Tuple, Literal, Callable
import random
import copy
from dataclasses import dataclass
import asyncio
import json


@dataclass
class Seed:
    code: str
    name: str


seeds = [Seed(code='111', name='KWS_KERIDOS'),
         Seed(code='222', name='KWS_KERIDOS_YG')]


async def scan_cell():
    await asyncio.sleep(0.1)
    return random.choice(['UNKNOWN', 'ERROR'] + list(map(lambda seed: seed.code, seeds)))

# simulates external service


async def get_name(code: str):
    await asyncio.sleep(1)
    found = list(filter(lambda s: s.code == code, seeds))
    if found != []:
        return found[0].name
    else:
        return code


@dataclass
class Cell:
    row: int
    col: int
    name: str


class Scan:
    _BOARD_SIZE = 10
    _scanning = False
    publish: Callable

    def _resetBoard(self):
        self._board = [Cell(row=row, col=col, name='UNKNOWN') for row in range(
            0, self._BOARD_SIZE) for col in range(0, self._BOARD_SIZE)]

    def __init__(self, publish) -> None:
        self.publish = publish
        self._resetBoard()

    def _set_name(self, name: str, row, col):
        found = list(filter(lambda r: r.row ==
                            row and r.col == col, self._board))
        found[0].name = name

    def read_board(self):
        return [obj.__dict__ for obj in self._board]

    def startScanning(self):
        loop = asyncio.get_event_loop()
        loop.create_task(self._scan())

    def stopScanning(self):
        self._scanning = False

    def isScanning(self):
        return self._scanning

    async def _scan(self):
        self._resetBoard()
        self._scanning = True
        await self.publish({'scanning': True, 'cells': self.read_board()})
        for row in range(self._BOARD_SIZE):
            for col in range(self._BOARD_SIZE):
                if not self._scanning:
                    await self.publish({'scanning': False})
                    return
                print('scanning', row, col)
                code = await scan_cell()
                name = await get_name(code)
                self._set_name(name, row, col)
                await self.publish({'scanning': True, 'cells':
                                    [{'name': name, 'row': row, 'col': col}]})
