import React, { useCallback, useEffect } from 'react'
import { useState } from 'reinspect'
import { Flex, Box, Button, Collapse } from '@chakra-ui/core'
import { useAutoCallback, useAutoMemo, useAutoEffect } from 'hooks.macro'
import { gql } from '@apollo/client'

import {
    useStartMutation,
    useStopMutation,
    useReadBoardQuery,
    ScanDocument,
    ScanSubscription,
} from '~/generated/graphql'

gql`
    query ReadBoard {
        read_board {
            col
            row
            name
        }
    }
`
gql`
    mutation Start {
        start
    }
`
gql`
    mutation Stop {
        stop
    }
`
gql`
    subscription Scan {
        scan_updates {
            cells {
                col
                row
                name
            }
            scanning
        }
    }
`

let CELL_WDITH = 60

let colors = {
    KWS_KERIDOS: '#4CC9F6',
    KWS_KERIDOS_YG: '#F66F19',
    UNKNOWN: '#DADA2A',
    ERROR: '#6D6D6D',
}
let getColor = (name: string): string => (colors as { [index: string]: string })[name] ?? getColor('ERROR')

export function Scan() {
    let { data: dataBoard, subscribeToMore } = useReadBoardQuery()
    let [startMutation] = useStartMutation()
    let [stopMutation] = useStopMutation()
    console.log('dataBoard', dataBoard)

    useEffect(() => {
        subscribeToMore<ScanSubscription>({
            document: ScanDocument,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev
                }

                let { cells, scanning } = subscriptionData.data.scan_updates
                if (!cells) {
                    return prev
                }
                let newBoard = prev.read_board.slice()
                cells.forEach((cell) => {
                    let { col, row } = cell
                    let index = prev.read_board.findIndex((r) => r.row === row && r.col == col)
                    newBoard[index] = cell
                })
                return Object.assign({}, prev, { read_board: newBoard })
            },
        })
    }, [subscribeToMore])

    let grid = useAutoMemo(() =>
        dataBoard?.read_board.reduce((acc, { col, row, name }) => {
            if (col === 0) {
                acc.push([])
            }
            acc[row][col] = name
            return acc
        }, [] as string[][])
    )

    return (
        <Box data-id='Scan' h='full' ml={8}>
            <Button mr={8} variantColor='teal' onClick={() => startMutation()}>
                Start
            </Button>
            <Button variantColor='teal' onClick={() => stopMutation()}>
                Stop
            </Button>

            <Flex>
                <Box d='flex' mt={6}>
                    <Box data-id='Grid' boxShadow='4px 4px 15px 3px #bbbbbb' borderRadius='3px'>
                        {grid?.map((row, rowIndex) => (
                            <Box key={rowIndex} h={CELL_WDITH + 'px'} d='flex'>
                                {row.map((cell, colIndex) => (
                                    <Box
                                        key={colIndex}
                                        bg={getColor(cell)}
                                        w={CELL_WDITH + 'px'}
                                        m='2px'
                                        borderRadius='3px'
                                        border='solid 1px black'
                                    />
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Box ml={8} mt={8}>
                    {Object.entries(colors).map(([name, color], index) => (
                        <Box d='flex' key={index} mb={3} alignItems='center'>
                            <Box
                                d='flex'
                                key={index}
                                bg={color}
                                w='20px'
                                h='20px'
                                m='2px'
                                borderRadius='3px'
                                border='solid 1px black'
                            />
                            <Box ml={4}>{name}</Box>
                        </Box>
                    ))}
                </Box>
            </Flex>
        </Box>
    )
}
