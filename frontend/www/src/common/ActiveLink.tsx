import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { Link, LinkProps } from '@chakra-ui/core'
import NextLink from 'next/link'
import { useAutoCallback, useAutoMemo, useAutoEffect } from 'hooks.macro'

export const RouteLink: FC<{ href: string } & LinkProps> = ({ children, href, ...props }) => {
    const router = useRouter()
    const style = useAutoMemo({
        // fontSize: '18px',
        color: 'rgb(53,64,82,0.75)',
        _hover: {
            bg: 'gray.200',
        },
        // _active: {
        // bg: 'gray.300',
        // boxShadow: '0 0 3px rgb(100,100,100)',
        // },
        _focus: {
            boxShadow: ['', '0 0 0 3px rgb(200,200,200)'],
            // bg: 'gray.300',
        },
        ...(router.pathname === href
            ? {
                  bg: 'gray.100',
              }
            : {}),
    })

    return (
        <NextLink href={href} passHref shallow>
            <Link {...style} {...props}>
                {children}
            </Link>
        </NextLink>
    )
}
